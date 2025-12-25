# Panduan Menjalankan Aplikasi SimpanAja

## Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- File `.env` sudah dikonfigurasi dengan environment variables yang diperlukan

## Environment Variables yang Diperlukan

### File `.env` (root project)
Untuk client (React):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### File `server/.env`
Untuk server (Express):
```
SUPABASE_DB_URL=your_database_connection_string
```

### Environment Variables Lainnya (Opsional)
- `DATABASE_URL` - untuk Drizzle ORM migrations
- `SUPABASE_API_KEY` - untuk Supabase CLI (jika menggunakan)
- `PORT` - Port untuk server (default: 5000)

## Langkah-langkah Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Pastikan File .env Sudah Dikonfigurasi
Pastikan file `.env` (di root) dan `server/.env` sudah berisi environment variables yang diperlukan.

### 3. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di:
- **URL**: `http://localhost:5000` (atau port yang ditentukan di environment variable `PORT`)

### 4. Buka di Browser
Buka browser dan akses: `http://localhost:5000`

## Scripts yang Tersedia

- `npm run dev` - Menjalankan development server (Express + Vite)
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Menjalankan production server
- `npm run check` - Type checking dengan TypeScript
- `npm run db:push` - Push database migrations dengan Drizzle

## Troubleshooting

### Error: Missing Supabase environment variables
Pastikan file `.env` berisi:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Error: Missing SUPABASE_DB_URL
Pastikan file `server/.env` berisi:
- `SUPABASE_DB_URL`

### Port sudah digunakan
Ubah port dengan set environment variable:
```bash
# Windows PowerShell
$env:PORT=3000; npm run dev

# Windows CMD
set PORT=3000 && npm run dev

# Linux/Mac
PORT=3000 npm run dev
```

### Database connection error
Pastikan connection string di `server/.env` sudah benar dan database sudah running.

