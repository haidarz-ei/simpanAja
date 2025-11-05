import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from server/.env
dotenv.config({ path: './server/.env' });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to Supabase database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };

// Database query helper functions
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

// Package data interface matching our database schema
export interface PackageRecord {
  id: string;
  created_at: string;
  last_updated: string;

  // Sender info
  sender_name?: string;
  sender_phone?: string;
  sender_address?: string;
  sender_city?: string;
  sender_province?: string;
  sender_district?: string;
  sender_postal_code?: string;

  // Receiver info
  receiver_name?: string;
  receiver_phone?: string;
  receiver_address?: string;
  receiver_city?: string;
  receiver_province?: string;
  receiver_district?: string;
  receiver_postal_code?: string;

  // Package info
  package_weight?: string;
  package_description?: string;
  package_length?: string;
  package_width?: string;
  package_height?: string;

  // Additional options
  packing_option?: string;
  delivery_method?: 'pickup' | 'delivery';
  payment_method?: 'transfer' | 'cash';

  // Status
  is_complete: boolean;
  payment_status?: 'pending' | 'paid' | 'failed';
  tracking_code?: string;

  // Timestamps
  submitted_at?: string;

  // Soft delete
  deleted: boolean;

  // Session tracking
  user_session_id: string;
}
