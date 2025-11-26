import { supabase, PackageData, PaymentData } from './supabase'
import type { InsertPengirim, Pengirim, InsertPenerima, Penerima, InsertDetailPaket, DetailPaket, InsertOpsiPacking, OpsiPacking, InsertLayananKurir, LayananKurir, InsertPackages, Packages } from '../../shared/schema'

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

  // Get single incomplete package for current user (STRICTLY ONE ONLY - Single Card Rule)
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

  // Check if user already has an incomplete package (prevents auto-creation)
  async hasIncompletePackage(): Promise<boolean> {
    const existing = await this.getIncompletePackage()
    return existing !== null
  },

  // Create NEW incomplete package ONLY when explicitly requested (Single Card Rule)
  async createNewPackage(): Promise<PackageData> {
    const userId = await getCurrentUserId()
    const deviceId = getDeviceId()

    // Check if user already has incomplete package - BLOCK creation if exists
    const existingIncomplete = await this.getIncompletePackage()
    if (existingIncomplete) {
      throw new Error('Anda sudah memiliki kartu paket yang belum lengkap. Selesaikan kartu tersebut terlebih dahulu atau hapus untuk membuat yang baru.')
    }

    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          user_id: userId,
          device_id: deviceId,
          status: 'draft', // Start as draft
          step_completed: 0,
          deleted: false,
          is_complete: false
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')

      const newPackage = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        device_id: deviceId,
        status: 'draft',
        step_completed: 0,
        deleted: false,
        is_complete: false,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      } as PackageData

      localPackages.push(newPackage)
      localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
      return newPackage
    }
  },

  // Auto-save package (ONLY updates existing incomplete package - NO auto-creation - Single Card Rule)
  async autoSavePackage(packageData: Partial<PackageData>, step: number): Promise<PackageData> {
    const userId = await getCurrentUserId()
    const deviceId = getDeviceId()

    try {
      // Get existing incomplete package (should only be one)
      const existingPackage = await this.getIncompletePackage()

      if (!existingPackage) {
        // NO auto-creation allowed! User must explicitly create new package
        throw new Error('Tidak ada kartu paket yang belum lengkap. Buat kartu baru terlebih dahulu.')
      }

      // Determine if package should be marked as incomplete based on Step 1 data
      const hasStep1Data = packageData.sender_name || packageData.sender_phone || packageData.sender_address ||
                          packageData.receiver_name || packageData.receiver_phone || packageData.receiver_address ||
                          packageData.package_weight || packageData.package_description

      // Update existing incomplete package
      const { data, error } = await supabase
        .from('packages')
        .update({
          ...packageData,
          step_completed: step,
          status: hasStep1Data && step === 1 ? 'in_progress' : existingPackage.status,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingPackage.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Fallback to localStorage if Supabase fails
      const localPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]')
      const existingLocal = localPackages.find((p: PackageData) =>
        (p.user_id === userId || p.device_id === deviceId) &&
        !p.is_complete &&
        !p.deleted
      )

      if (!existingLocal) {
        throw new Error('Tidak ada kartu paket yang belum lengkap. Buat kartu baru terlebih dahulu.')
      }

      // Update existing local package
      const hasStep1Data = packageData.sender_name || packageData.sender_phone || packageData.sender_address ||
                          packageData.receiver_name || packageData.receiver_phone || packageData.receiver_address ||
                          packageData.package_weight || packageData.package_description

      const updated = {
        ...existingLocal,
        ...packageData,
        step_completed: step,
        status: hasStep1Data && step === 1 ? 'in_progress' : existingLocal.status,
        last_updated: new Date().toISOString()
      }
      const index = localPackages.findIndex((p: PackageData) => p.id === existingLocal.id)
      localPackages[index] = updated
      localStorage.setItem('simpanaja_packages', JSON.stringify(localPackages))
      return updated
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

  // Complete package ONLY when tracking code is generated (Single Card Rule)
  async completePackageWithTrackingCode(id: string, trackingCode: string): Promise<PackageData> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          status: 'completed',
          step_completed: 3,
          is_complete: true, // ONLY mark complete when tracking code exists
          tracking_code: trackingCode,
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
          step_completed: 3,
          is_complete: true,
          tracking_code: trackingCode,
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
  },

  // Validate package completion status based on business rules
  validatePackageStatus(packageData: PackageData): { isValid: boolean, message: string } {
    // Rule: Package is incomplete if Step 1 has any data but no tracking code
    const hasStep1Data = packageData.sender_name || packageData.sender_phone || packageData.sender_address ||
                        packageData.receiver_name || packageData.receiver_phone || packageData.receiver_address ||
                        packageData.package_weight || packageData.package_description

    if (hasStep1Data && !packageData.tracking_code) {
      return {
        isValid: false,
        message: 'Kartu paket belum lengkap - data Step 1 sudah diisi tetapi belum ada kode tracking'
      }
    }

    // Rule: Package is complete ONLY if it has tracking code
    if (packageData.tracking_code) {
      return {
        isValid: true,
        message: 'Kartu paket lengkap dengan kode tracking'
      }
    }

    // Rule: Empty package (no Step 1 data) is draft
    return {
      isValid: true,
      message: 'Kartu paket dalam status draft'
    }
  },


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
