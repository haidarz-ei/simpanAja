// server/index.ts
import express2 from "express";
import { createServer } from "http";

// server/database.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
var pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  ssl: process.env.SUPABASE_DB_URL ? {
    rejectUnauthorized: false
    // Required for Supabase
  } : false
  // No SSL for local development
});
pool.on("connect", () => {
  console.log("Connected to Supabase database");
});
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
var query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

// server/routes.ts
function registerRoutes(app2) {
  app2.get("/api/packages", async (req, res) => {
    try {
      const result = await query("SELECT * FROM packages WHERE deleted = false ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });
  app2.get("/api/packages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query("SELECT * FROM packages WHERE id = $1 AND deleted = false", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ error: "Failed to fetch package" });
    }
  });
  app2.post("/api/packages", async (req, res) => {
    try {
      const packageData = req.body;
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
      console.error("Error creating package:", error);
      res.status(500).json({ error: "Failed to create package" });
    }
  });
  app2.put("/api/packages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const packageData = req.body;
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
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating package:", error);
      res.status(500).json({ error: "Failed to update package" });
    }
  });
  app2.delete("/api/packages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query("UPDATE packages SET deleted = true, last_updated = NOW() WHERE id = $1 AND deleted = false RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ error: "Failed to delete package" });
    }
  });
  app2.get("/api/payments", async (req, res) => {
    try {
      const result = await query("SELECT * FROM payments ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });
  app2.get("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query("SELECT * FROM payments WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });
  app2.get("/api/packages/:packageId/payment", async (req, res) => {
    try {
      const { packageId } = req.params;
      const result = await query("SELECT * FROM payments WHERE package_id = $1 ORDER BY created_at DESC LIMIT 1", [packageId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Payment not found for this package" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching payment for package:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const paymentData = req.body;
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
        paymentData.status || "pending",
        paymentData.transaction_id
      ]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });
  app2.put("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const paymentData = req.body;
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
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Failed to update payment" });
    }
  });
  app2.delete("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query("DELETE FROM payments WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  });
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    configFile: path.resolve(import.meta.dirname, "..", "vite.config.ts"),
    server: serverOptions,
    appType: "custom",
    customLogger: viteLogger
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.endsWith(".js") || url.endsWith(".mjs") || url.startsWith("/api/") || url.startsWith("/@vite/") || url.startsWith("/@fs/") || url.startsWith("/node_modules/") || url.startsWith("/src/") || url.startsWith("/static/")) {
      return next();
    }
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = createServer(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  registerRoutes(app);
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: process.platform !== "win32"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
