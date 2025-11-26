import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // pooler pakai self-signed, jadi ini perlu
  prepare: false,
});

export const db = drizzle(client);
