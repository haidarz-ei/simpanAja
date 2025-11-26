import { sql } from "drizzle-orm";
import { pgTable, text, uuid, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// 1. Tabel pengirim
export const pengirim = pgTable("pengirim", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nama: text("nama").notNull(),
  hp: text("hp"),
  alamat: text("alamat"),
  provinsi: text("provinsi"),
  kota: text("kota"),
  kecamatan: text("kecamatan"),
  kodepos: text("kodepos"),
  created_at: timestamp("created_at").defaultNow(),
});

// 2. Tabel penerima
export const penerima = pgTable("penerima", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nama: text("nama").notNull(),
  hp: text("hp"),
  alamat: text("alamat"),
  provinsi: text("provinsi"),
  kota: text("kota"),
  kecamatan: text("kecamatan"),
  kodepos: text("kodepos"),
  created_at: timestamp("created_at").defaultNow(),
});

// 3. Tabel detail_paket
export const detail_paket = pgTable("detail_paket", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  berat: numeric("berat"),
  deskripsi: text("deskripsi"),
  panjang: numeric("panjang"),
  lebar: numeric("lebar"),
  tinggi: numeric("tinggi"),
  created_at: timestamp("created_at").defaultNow(),
});

// 4. Tabel opsi_packing
export const opsi_packing = pgTable("opsi_packing", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bubble_wrap: boolean("bubble_wrap").default(false),
  kardus: boolean("kardus").default(false),
  kayu: boolean("kayu").default(false),
  asuransi: boolean("asuransi").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// 5. Tabel layanan_kurir
export const layanan_kurir = pgTable("layanan_kurir", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  kurir: text("kurir").notNull(),
  layanan: text("layanan").notNull(),
  estimasi_hari: integer("estimasi_hari"),
  harga: integer("harga"),
  created_at: timestamp("created_at").defaultNow(),
});

// 6. Tabel packages (induk)
export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  kode_paket: text("kode_paket").notNull(),
  pengirim_id: uuid("pengirim_id").references(() => pengirim.id, { onDelete: "cascade" }),
  penerima_id: uuid("penerima_id").references(() => penerima.id, { onDelete: "cascade" }),
  detail_paket_id: uuid("detail_paket_id").references(() => detail_paket.id, { onDelete: "cascade" }),
  opsi_packing_id: uuid("opsi_packing_id").references(() => opsi_packing.id, { onDelete: "cascade" }),
  layanan_kurir_id: uuid("layanan_kurir_id").references(() => layanan_kurir.id, { onDelete: "cascade" }),
  status: text("status").default("draft"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 7. Update payments
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  packages_id: uuid("packages_id").references(() => packages.id, { onDelete: "cascade" }),
  amount: integer("amount"),
  method: text("method"),
  delivery_method: text("delivery_method"),
  selected_office: text("selected_office"),
  status: text("status"),
  transaction_id: text("transaction_id"),
  payment_date: timestamp("payment_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: uuid("user_id"),
});
