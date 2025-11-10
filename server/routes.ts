import type { Express } from "express";
import { storage } from "./storage";
import { query, PackageRecord } from "./database";

export function registerRoutes(app: Express) {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // API Routes for packages
  app.get('/api/packages', async (req, res) => {
    try {
      const result = await query('SELECT * FROM packages WHERE deleted = false ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({ error: 'Failed to fetch packages' });
    }
  });

  app.get('/api/packages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM packages WHERE id = $1 AND deleted = false', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching package:', error);
      res.status(500).json({ error: 'Failed to fetch package' });
    }
  });

  app.post('/api/packages', async (req, res) => {
    try {
      const packageData: Partial<PackageRecord> = req.body;

      // Generate UUID for new package
      const id = crypto.randomUUID();

      const result = await query(`
        INSERT INTO packages (
          id, sender_name, sender_phone, sender_address, sender_city, sender_province,
          sender_district, sender_postal_code, receiver_name, receiver_phone,
          receiver_address, receiver_city, receiver_province, receiver_district,
          receiver_postal_code, package_weight, package_description, package_length,
          package_width, package_height, packing_option, delivery_method,
          payment_method, is_complete, payment_status, user_session_id, deleted
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
        ) RETURNING *
      `, [
        id,
        packageData.sender_name,
        packageData.sender_phone,
        packageData.sender_address,
        packageData.sender_city,
        packageData.sender_province,
        packageData.sender_district,
        packageData.sender_postal_code,
        packageData.receiver_name,
        packageData.receiver_phone,
        packageData.receiver_address,
        packageData.receiver_city,
        packageData.receiver_province,
        packageData.receiver_district,
        packageData.receiver_postal_code,
        packageData.package_weight,
        packageData.package_description,
        packageData.package_length,
        packageData.package_width,
        packageData.package_height,
        packageData.packing_option,
        packageData.delivery_method,
        packageData.payment_method,
        packageData.is_complete || false,
        packageData.payment_status || 'pending',
        packageData.user_session_id,
        false
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating package:', error);
      res.status(500).json({ error: 'Failed to create package' });
    }
  });

  app.put('/api/packages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const packageData: Partial<PackageRecord> = req.body;

      const result = await query(`
        UPDATE packages SET
          sender_name = $2, sender_phone = $3, sender_address = $4, sender_city = $5,
          sender_province = $6, sender_district = $7, sender_postal_code = $8,
          receiver_name = $9, receiver_phone = $10, receiver_address = $11,
          receiver_city = $12, receiver_province = $13, receiver_district = $14,
          receiver_postal_code = $15, package_weight = $16, package_description = $17,
          package_length = $18, package_width = $19, package_height = $20,
          packing_option = $21, delivery_method = $22, payment_method = $23,
          is_complete = $24, payment_status = $25, last_updated = NOW()
        WHERE id = $1 AND deleted = false
        RETURNING *
      `, [
        id,
        packageData.sender_name,
        packageData.sender_phone,
        packageData.sender_address,
        packageData.sender_city,
        packageData.sender_province,
        packageData.sender_district,
        packageData.sender_postal_code,
        packageData.receiver_name,
        packageData.receiver_phone,
        packageData.receiver_address,
        packageData.receiver_city,
        packageData.receiver_province,
        packageData.receiver_district,
        packageData.receiver_postal_code,
        packageData.package_weight,
        packageData.package_description,
        packageData.package_length,
        packageData.package_width,
        packageData.package_height,
        packageData.packing_option,
        packageData.delivery_method,
        packageData.payment_method,
        packageData.is_complete,
        packageData.payment_status
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating package:', error);
      res.status(500).json({ error: 'Failed to update package' });
    }
  });

  app.delete('/api/packages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('UPDATE packages SET deleted = true, last_updated = NOW() WHERE id = $1 AND deleted = false RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }

      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({ error: 'Failed to delete package' });
    }
  });


}
