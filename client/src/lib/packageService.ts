import { supabase, PackageData } from './supabase'

// Get user session ID (for anonymous users)
export const getUserSessionId = (): string => {
  let sessionId = localStorage.getItem('user_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('user_session_id', sessionId)
  }
  return sessionId
}

// Get device ID
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
  // Get all packages for current user session
  async getPackages(): Promise<PackageData[]> {
    const sessionId = getUserSessionId()
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('user_session_id', sessionId)
      .eq('deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get incomplete packages for recovery
  async getIncompletePackages(): Promise<PackageData[]> {
    const sessionId = getUserSessionId()
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('user_session_id', sessionId)
      .eq('deleted', false)
      .in('status', ['draft', 'in_progress'])
      .order('last_updated', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new package
  async createPackage(packageData: Omit<PackageData, 'id' | 'created_at' | 'last_updated' | 'deleted' | 'user_session_id' | 'device_id' | 'status' | 'step_completed'>): Promise<PackageData> {
    const sessionId = getUserSessionId()
    const deviceId = getDeviceId()
    const { data, error } = await supabase
      .from('packages')
      .insert({
        ...packageData,
        user_session_id: sessionId,
        device_id: deviceId,
        status: 'draft',
        step_completed: 0,
        deleted: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Auto-save package (update existing or create new)
  async autoSavePackage(packageData: Partial<PackageData>, step: number): Promise<PackageData> {
    const sessionId = getUserSessionId()
    const deviceId = getDeviceId()

    let data: PackageData;

    try {
      // Check if there's an existing in-progress package
      const { data: existingPackages, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .eq('user_session_id', sessionId)
        .eq('status', 'in_progress')
        .eq('deleted', false)
        .order('last_updated', { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError

      const existingPackage = existingPackages?.[0]

      if (existingPackage) {
        // Update existing package
        const { data: updatedData, error } = await supabase
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
        data = updatedData
      } else {
        // Create new package in database immediately
        const { data: newData, error } = await supabase
          .from('packages')
          .insert({
            ...packageData,
            user_session_id: sessionId,
            device_id: deviceId,
            status: 'in_progress',
            step_completed: step,
            deleted: false,
            is_complete: false
          })
          .select()
          .single()

        if (error) throw error
        data = newData
      }
    } catch (error) {
      // If Supabase fails, create local data with generated ID
      const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      data = {
        id: localId,
        user_session_id: sessionId,
        device_id: deviceId,
        status: 'in_progress',
        step_completed: step,
        deleted: false,
        is_complete: false,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        ...packageData
      } as PackageData
    }

    // Also save to localStorage as backup
    const existingLocalPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]');
    const existingIndex = existingLocalPackages.findIndex((p: PackageData) => p.id === data.id);
    if (existingIndex >= 0) {
      existingLocalPackages[existingIndex] = data;
    } else {
      existingLocalPackages.push(data);
    }
    localStorage.setItem('simpanaja_packages', JSON.stringify(existingLocalPackages));

    return data
  },

  // Update package
  async updatePackage(id: string, updates: Partial<PackageData>): Promise<PackageData> {
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
  },

  // Complete package (move to payment pending)
  async completePackage(id: string): Promise<PackageData> {
    const { data, error } = await supabase
      .from('packages')
      .update({
        status: 'payment_pending',
        step_completed: 3,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Finalize package (after payment)
  async finalizePackage(id: string, trackingCode: string): Promise<PackageData> {
    const { data, error } = await supabase
      .from('packages')
      .update({
        status: 'completed',
        tracking_code: trackingCode,
        payment_status: 'paid',
        is_complete: true,
        submitted_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
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
