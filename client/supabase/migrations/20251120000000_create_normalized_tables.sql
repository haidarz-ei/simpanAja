-- 20251120000000_create_normalized_tables.sql

-- 1. Tabel pengirim
CREATE TABLE pengirim (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    hp TEXT,
    alamat TEXT,
    provinsi TEXT,
    kota TEXT,
    kecamatan TEXT,
    kodepos TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- 2. Tabel penerima
CREATE TABLE penerima (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    hp TEXT,
    alamat TEXT,
    provinsi TEXT,
    kota TEXT,
    kecamatan TEXT,
    kodepos TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- 3. Tabel detail_paket
CREATE TABLE detail_paket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    berat NUMERIC,
    deskripsi TEXT,
    panjang NUMERIC,
    lebar NUMERIC,
    tinggi NUMERIC,
    created_at TIMESTAMP DEFAULT now()
);

-- 4. Tabel opsi_packing
CREATE TABLE opsi_packing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bubble_wrap BOOLEAN DEFAULT FALSE,
    kardus BOOLEAN DEFAULT FALSE,
    kayu BOOLEAN DEFAULT FALSE,
    asuransi BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

-- 5. Tabel layanan_kurir
CREATE TABLE layanan_kurir (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kurir TEXT NOT NULL,
    layanan TEXT NOT NULL,
    estimasi_hari INTEGER,
    harga INTEGER,
    created_at TIMESTAMP DEFAULT now()
);

-- 6. Tabel packages (tabel induk)
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_paket TEXT UNIQUE NOT NULL,
    pengirim_id UUID REFERENCES pengirim(id) ON DELETE CASCADE,
    penerima_id UUID REFERENCES penerima(id) ON DELETE CASCADE,
    detail_paket_id UUID REFERENCES detail_paket(id) ON DELETE CASCADE,
    opsi_packing_id UUID REFERENCES opsi_packing(id) ON DELETE CASCADE,
    layanan_kurir_id UUID REFERENCES layanan_kurir(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 7. Update tabel payments untuk relasi ke packages baru
-- ALTER TABLE payments
--     DROP CONSTRAINT IF EXISTS payments_package_id_fkey;

-- ALTER TABLE payments
--     ADD COLUMN packages_id UUID REFERENCES packages(id) ON DELETE CASCADE;

-- ALTER TABLE payments
--     DROP COLUMN IF EXISTS package_id;
