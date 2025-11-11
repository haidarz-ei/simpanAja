import type { Express } from "express";
import { storage } from "./storage";
import { query, PackageRecord, PaymentRecord } from "./database";

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
          payment_method, is_complete, user_session_id, deleted
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
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
          is_complete = $24, last_updated = NOW()
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
        packageData.is_complete
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

  // API Routes for payments
  app.get('/api/payments', async (req, res) => {
    try {
      const result = await query('SELECT * FROM payments ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  app.get('/api/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  });

  app.get('/api/packages/:packageId/payment', async (req, res) => {
    try {
      const { packageId } = req.params;
      const result = await query('SELECT * FROM payments WHERE package_id = $1 ORDER BY created_at DESC LIMIT 1', [packageId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Payment not found for this package' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching payment for package:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const paymentData: Partial<PaymentRecord> = req.body;

      // Generate UUID for new payment
      const id = crypto.randomUUID();

      const result = await query(`
        INSERT INTO payments (
          id, package_id, amount, method, delivery_method, selected_office, status, transaction_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING *
      `, [
        id,
        paymentData.package_id,
        paymentData.amount,
        paymentData.method,
        paymentData.delivery_method,
        paymentData.selected_office,
        paymentData.status || 'pending',
        paymentData.transaction_id
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  app.put('/api/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const paymentData: Partial<PaymentRecord> = req.body;

      const result = await query(`
        UPDATE payments SET
          amount = $2, method = $3, delivery_method = $4, selected_office = $5,
          status = $6, transaction_id = $7, payment_date = $8, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [
        id,
        paymentData.amount,
        paymentData.method,
        paymentData.delivery_method,
        paymentData.selected_office,
        paymentData.status,
        paymentData.transaction_id,
        paymentData.payment_date
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  });

  app.delete('/api/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  });


}
