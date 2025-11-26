import { defineConfig } from "drizzle-kit";

// When running locally against databases with self-signed certs (e.g. some
// hosted dev pools) we can disable Node's TLS certificate verification for
// this process in non-production environments. This is a development-only
// workaround and MUST NOT be used in production.
// Prefer DEV_DATABASE_URL when running locally so developers can run migrations
// against a local DB without touching remote/prod connection strings.
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - node env variable for TLS verification
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // In local development allow developers to set DEV_DATABASE_URL to a
    // local Postgres instance (e.g. via docker-compose.dev.yml). When
    // not set, fall back to DATABASE_URL.
    url: process.env.DEV_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
});









