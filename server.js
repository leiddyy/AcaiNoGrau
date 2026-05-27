require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL in environment variables.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : false,
});

app.use(cors({ origin: true }));
app.use(express.json());

// Serve static files from dist (React app)
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/health", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    res.json({ status: "ok", now: new Date().toISOString() });
  } catch (error) {
    console.error("Health check error:", error.message);
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.get("/api/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/menu error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 200"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/orders error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  const {
    customer_name,
    phone,
    delivery_address,
    items,
    total,
    type,
    status,
    payment_method,
    payment_details,
  } = req.body;

  if (!customer_name || !phone || !items || !total || !type || !payment_method) {
    return res.status(400).json({
      error: "customer_name, phone, items, total, type and payment_method are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, phone, delivery_address, items, total, type, status, payment_method, payment_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        customer_name,
        phone,
        delivery_address || null,
        JSON.stringify(items),
        total,
        type,
        status || "novo",
        payment_method,
        JSON.stringify(payment_details || {}),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/orders error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// SPA fallback: serve index.html for non-API routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
