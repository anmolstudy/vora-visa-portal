import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import demandRoutes from "./routes/demandRoutes.js";
import adminRoutes from "./routes/admin.js";
import visaRoutes from "./routes/visaRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import {
  apiLimiter,
  sanitizeInput,
  sanitizeMongoInput,
  securityHeaders,
  requestLogger,
} from "./middleware/security.middleware.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(securityHeaders);
app.use(requestLogger);

// ─── CORS: restrict to known origins ─────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin && process.env.NODE_ENV !== "production") return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── NoSQL Injection Prevention ───────────────────────────────────────────────
// express-mongo-sanitize tries to overwrite req.query which is read-only in
// Express 5, causing a TypeError. We sanitize body/params only (query strings
// don't reach MongoDB directly in this app), and deep-strip $ / . keys.
app.use(sanitizeMongoInput);

// ─── XSS Sanitization (HTML entity encoding) ──────────────────────────────────
app.use(sanitizeInput);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ─── Static Uploads ───────────────────────────────────────────────────────────
// __dirname resolves to <project>/backend/src — go two levels up to reach
// <project>/backend/uploads (where multer saves files).
const uploadsDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, "../../uploads");
app.use("/uploads", express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/demand", demandRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/visa", visaRoutes);
app.use("/api/payments", paymentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// ─── 404 + Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Process Error Handling ───────────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
