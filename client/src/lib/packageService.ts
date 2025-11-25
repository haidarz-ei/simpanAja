import { supabase, PackageData, PaymentData } from './supabase'

// Get current authenticated user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

// Get device ID (for additional tracking)
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}

// Package CRUD operations
export const packageService = {
  // Get all packages for current authenticated user
  async getPackages(): Promise<PackageData[]> {
    const userId = await getCurrentUserId()
    if (!userId) return []

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get single incomplete package for current user (only one allowed)
  async getIncompletePackage(): Promise<PackageData | null> {
    try {
      const userId = await getCurrentUserId()
      const deviceId = getDeviceId()

      let query = supabase
        .from('packages')
        .select('*')
        .eq('deleted', false)
        .eq('is_complete', false)
        .in('status', ['draft', 'in_progress'])
        .order('last_updated', { ascending: false })
        .limit(1)

      if (userId) {
        query = query.eq('user_id', userId)
      } else {
        // For anonymous users, filter by device_id
        query = query.eq('device_id', deviceId)
      }

      const { data, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      console.warn('Supabase not available, falling back to localStorage for incomplete package')
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const userId = await getCurrentUserId()
      const deviceId = getDeviceId()

      const incompleteLocal = localPackages.find((p: PackageData) =>
        (p.user_id === userId || p.device_id === deviceId) &&
        !p.is_complete &&
        !p.deleted
      )

      return incompleteLocal || null
    }
  },

  // Auto-save package (single incomplete package per user)
  async autoSavePackage(packageData: Partial<PackageData>, step: number): Promise<PackageData> {
    const userId = await getCurrentUserId()
    // Allow anonymous users to save packages (userId can be null)
    // if (!userId) throw new Error('User not authenticated')

    const deviceId = getDeviceId()

    try {
      // Check if there's an existing incomplete package for this user
      const existingPackage = await this.getIncompletePackage()

      if (existingPackage) {
        // Update existing incomplete package
        const { data, error } = await supabase
          .from('packages')
          .update({
            ...packageData,
            step_completed: step,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingPackage.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new incomplete package (only if none exists)
        const { data, error } = await supabase
          .from('packages')
          .insert({
            ...packageData,
            user_id: userId,
            device_id: deviceId,
            status: 'in_progress',
            step_completed: step,
            deleted: false,
            is_complete: false
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const existingLocal = localPackages.find((p: PackageData) =>
        p.user_id === userId && !p.is_complete && !p.deleted
      )

      if (existingLocal) {
        // Update existing local package
        const updated = {
          ...existingLocal,
          ...packageData,
          step_completed: step,
          last_updated: new Date().toISOString()
        }
        const index = localPackages.findIndex((p: PackageData) => p.id === existingLocal.id)
        localPackages[index] = updated
        localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
        return updated
      } else {
        // Create new local package
        const newPackage = {
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: userId,
          device_id: deviceId,
          status: 'in_progress',
          step_completed: step,
          deleted: false,
          is_complete: false,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          ...packageData
        } as PackageData
        localPackages.push(newPackage)
        localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
        return newPackage
      }
    }
  },

  // Update package
  async updatePackage(id: string, updates: Partial<PackageData>): Promise<PackageData> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          ...updates,
          last_updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const existingLocal = localPackages.find((p: PackageData) => p.id === id)

      if (existingLocal) {
        const updated = {
          ...existingLocal,
          ...updates,
          last_updated: new Date().toISOString()
        }
        const index = localPackages.findIndex((p: PackageData) => p.id === id)
        localPackages[index] = updated
        localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
        return updated
      } else {
        throw error
      }
    }
  },

  // Complete package (move to payment pending and mark as complete)
  async completePackage(id: string): Promise<PackageData> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          status: 'payment_pending',
          step_completed: 3,
          is_complete: true,
          last_updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const existingLocal = localPackages.find((p: PackageData) => p.id === id)

      if (existingLocal) {
        const updated = {
          ...existingLocal,
          status: 'payment_pending',
          step_completed: 3,
          is_complete: true,
          last_updated: new Date().toISOString()
        }
        const index = localPackages.findIndex((p: PackageData) => p.id === id)
        localPackages[index] = updated
        localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
        return updated
      } else {
        throw error
      }
    }
  },

  // Finalize package (after payment)
  async finalizePackage(id: string, trackingCode: string): Promise<PackageData> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          status: 'completed',
          tracking_code: trackingCode,
          is_complete: true,
          submitted_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const existingLocal = localPackages.find((p: PackageData) => p.id === id)

      if (existingLocal) {
        const updated = {
          ...existingLocal,
          status: 'completed',
          tracking_code: trackingCode,
          is_complete: true,
          submitted_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        }
        const index = localPackages.findIndex((p: PackageData) => p.id === id)
        localPackages[index] = updated
        localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
        return updated
      } else {
        throw error
      }
    }
  },

  // Soft delete package
  async deletePackage(id: string): Promise<void> {
    const { error } = await supabase
      .from('packages')
      .update({ deleted: true })
      .eq('id', id)

    if (error) throw error
  },

  // Get package by ID
  async getPackageById(id: string): Promise<PackageData | null> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .eq('deleted', false)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }
}

// Payment CRUD operations
export const paymentService = {
  // Get all payments
  async getPayments(): Promise<PaymentData[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get payment by ID
  async getPaymentById(id: string): Promise<PaymentData | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  // Get payment for a specific package
  async getPaymentForPackage(packageId: string): Promise<PaymentData | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('package_id', packageId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  // Create new payment
  async createPayment(paymentData: Omit<PaymentData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentData> {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update payment
  async updatePayment(id: string, updates: Partial<PaymentData>): Promise<PaymentData> {
    const { data, error } = await supabase
      .from('payments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: PaymentData['status'], transactionId?: string): Promise<PaymentData> {
    const updates: Partial<PaymentData> = {
      status,
      updated_at: new Date().toISOString()
    }

    if (transactionId) {
      updates.transaction_id = transactionId
    }

    if (status === 'paid') {
      updates.payment_date = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete payment
  async deletePayment(id: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
