import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wqqgwajlfyevlkunfpdt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcWd3YWpsZnlldmxrdW5mcGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDI2NzQsImV4cCI6MjA3NzQ3ODY3NH0.d3WxQVuhmRYV6yAsEyy8rj4J06SF3ELnrXMsXjkUI9k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PackageData {
  id: string
  created_at: string
  last_updated: string

  // Sender information
  sender_name?: string
  sender_phone?: string
  sender_address?: string
  sender_city?: string
  sender_province?: string
  sender_district?: string
  sender_postal_code?: string

  // Receiver information
  receiver_name?: string
  receiver_phone?: string
  receiver_address?: string
  receiver_city?: string
  receiver_province?: string
  receiver_district?: string
  receiver_postal_code?: string

  // Package information
  package_weight?: string
  package_description?: string
  package_length?: string
  package_width?: string
  package_height?: string

  // Courier information
  courier_name?: string
  courier_service_code?: string

  // Additional fields
  packing_options?: string[]
  delivery_method?: string
  payment_method?: string
  selected_office?: string

  // Status
  status?: string
  step_completed?: number
  is_complete?: boolean
  payment_status?: 'pending' | 'paid' | 'failed'
  tracking_code?: string

  // Timestamps
  submitted_at?: string

  // Soft delete
  deleted: boolean

  // Session tracking (for anonymous users)
  user_session_id: string
  device_id?: string
}

// TODO: Production deployment checklist:
// 1. Implement proper user authentication (Supabase Auth)
// 2. Set up Row Level Security (RLS) policies for authenticated users
// 3. Move sensitive environment variables to secure hosting platform
// 4. Implement rate limiting and API protection
// 5. Add data validation and sanitization
// 6. Set up database backups and monitoring
// 7. Implement proper error handling and logging
// 8. Add PWA service worker for offline functionality
// 9. Configure proper CORS settings for production domain
// 10. Set up CI/CD pipeline for automated deployments
