import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  
  senderName: text("sender_name").notNull(),
  senderPhone: text("sender_phone").notNull(),
  senderAddress: text("sender_address").notNull(),
  senderCity: text("sender_city").notNull(),
  senderPostalCode: text("sender_postal_code").notNull(),
  
  receiverName: text("receiver_name").notNull(),
  receiverPhone: text("receiver_phone").notNull(),
  receiverAddress: text("receiver_address").notNull(),
  receiverCity: text("receiver_city").notNull(),
  receiverPostalCode: text("receiver_postal_code").notNull(),
  
  packageWeight: decimal("package_weight").notNull(),
  packageLength: integer("package_length").notNull(),
  packageWidth: integer("package_width").notNull(),
  packageHeight: integer("package_height").notNull(),
  packageDescription: text("package_description"),
  
  courierCode: text("courier_code").notNull(),
  courierService: text("courier_service").notNull(),
  shippingCost: decimal("shipping_cost").notNull(),
  estimatedDays: text("estimated_days").notNull(),
  
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("unpaid"),
  
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;
