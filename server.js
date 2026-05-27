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

function isUndefinedTableError(error) {
  return (
    error?.code === "42P01" ||
    /relation .* does not exist/i.test(error?.message || "") ||
    /table .* does not exist/i.test(error?.message || "")
  );
}

function parseDeliveryAddress(address) {
  if (!address) return {};
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const result = { rua: null, numero: null, complemento: null, bairro: null };
  if (parts.length === 1) {
    result.rua = parts[0];
  } else if (parts.length === 2) {
    result.rua = parts[0];
    result.numero = parts[1];
  } else if (parts.length === 3) {
    result.rua = parts[0];
    result.numero = parts[1];
    result.bairro = parts[2];
  } else if (parts.length >= 4) {
    result.rua = parts[0];
    result.numero = parts[1];
    result.complemento = parts.slice(2, parts.length - 1).join(", ");
    result.bairro = parts[parts.length - 1];
  }
  return result;
}

function normalizePaymentMethodName(paymentMethod) {
  if (!paymentMethod) return null;
  const normalized = paymentMethod.toString().toLowerCase();
  if (normalized === "pix") return "Pix";
  if (normalized.includes("cartao") || normalized.includes("cartão")) {
    return "Cartão Crédito";
  }
  if (normalized === "dinheiro") return "Dinheiro";
  return paymentMethod;
}

async function insertRelationalOrder({
  customer_name,
  phone,
  delivery_address,
  total,
  type,
  status,
  payment_method,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const customerResult = await client.query(
      `INSERT INTO cliente (nome, telefone)
       VALUES ($1, $2)
       RETURNING id_cliente`,
      [customer_name, phone]
    );
    const clienteId = customerResult.rows[0].id_cliente;

    let enderecoId = null;
    if (delivery_address) {
      const { rua, numero, complemento, bairro } = parseDeliveryAddress(delivery_address);
      const enderecoResult = await client.query(
        `INSERT INTO endereco (cliente_id, rua, numero, bairro, complemento)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_endereco`,
        [clienteId, rua || delivery_address, numero, bairro, complemento]
      );
      enderecoId = enderecoResult.rows[0].id_endereco;
    }

    const methodName = normalizePaymentMethodName(payment_method);
    const paymentRow = await client.query(
      `SELECT id FROM formas_pagamento WHERE lower(nome) = lower($1) LIMIT 1`,
      [methodName]
    );
    const formaPagamentoId = paymentRow.rows[0]?.id || null;

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (cliente_id, endereco_id, forma_pagamento_id, status, tipo_entrega, subtotal, valor_total)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        clienteId,
        enderecoId,
        formaPagamentoId,
        status && status.toLowerCase() !== "novo" ? status : "Pendente",
        type,
        total,
        total,
      ]
    );

    await client.query("COMMIT");
    return {
      cliente_id: clienteId,
      endereco_id: enderecoId,
      pedido_id: pedidoResult.rows[0].id,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    if (isUndefinedTableError(error)) {
      return null;
    }
    throw error;
  } finally {
    client.release();
  }
}

async function insertLegacyOrder({
  customer_name,
  phone,
  delivery_address,
  items,
  total,
  type,
  status,
  payment_method,
  payment_details,
}) {
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
    return result.rows[0];
  } catch (error) {
    if (isUndefinedTableError(error)) {
      return null;
    }
    throw error;
  }
}

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
    const [legacyResult, relationalResult] = await Promise.allSettled([
      insertLegacyOrder({
        customer_name,
        phone,
        delivery_address,
        items,
        total,
        type,
        status,
        payment_method,
        payment_details,
      }),
      insertRelationalOrder({
        customer_name,
        phone,
        delivery_address,
        total,
        type,
        status,
        payment_method,
      }),
    ]);

    if (legacyResult.status === "fulfilled" && legacyResult.value) {
      return res.status(201).json(legacyResult.value);
    }

    if (relationalResult.status === "fulfilled" && relationalResult.value) {
      return res.status(201).json({
        message: "Pedido salvo nas tabelas relacionais",
        ...relationalResult.value,
      });
    }

    const errorMessage = relationalResult.status === "rejected"
      ? relationalResult.reason.message
      : "Não foi possível salvar o pedido em nenhuma tabela.";

    console.error("POST /api/orders error:", errorMessage);
    res.status(500).json({ error: errorMessage });
  } catch (error) {
    console.error("POST /api/orders error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// SPA fallback: serve index.html for non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
