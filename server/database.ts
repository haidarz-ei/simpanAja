import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from server/.env
dotenv.config({ path: './server/.env' });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  ssl: process.env.SUPABASE_DB_URL ? {
    rejectUnauthorized: false // Required for Supabase
  } : false // No SSL for local development
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
  tracking_code?: string;

  // Timestamps
  submitted_at?: string;

  // Soft delete
  deleted: boolean;

  // Session tracking
  user_session_id: string;
}

// Payment data interface for separate payments table
export interface PaymentRecord {
  id: string;
  package_id: string;
  amount: number;
  method?: 'ewallet' | 'transfer' | 'cash';
  delivery_method?: 'locker' | 'admin' | 'self';
  selected_office?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}
