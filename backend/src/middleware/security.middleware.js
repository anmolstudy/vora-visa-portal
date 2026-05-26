import rateLimit from "express-rate-limit";

// ─── General API Rate Limiter ─────────────────────────────────────────────────
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// ─── Stricter Limiter for Auth Routes ────────────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true,
});

// ─── NoSQL Injection Sanitizer (Express 5 compatible) ────────────────────────
// express-mongo-sanitize crashes on Express 5 because req.query is read-only.
// This version mutates object contents in-place instead of reassigning the
// top-level property, so it works safely with Express 4 and 5.
export const sanitizeMongoInput = (req, res, next) => {
  const stripKeys = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        stripKeys(obj[key]);
      }
    }
  };
  // Safely mutate body and params (never reassign req.query)
  stripKeys(req.body);
  stripKeys(req.params);
  // For query: read each key, strip dangerous ones, then delete+re-add values
  // We cannot do req.query = ... in Express 5, but we CAN delete/set individual keys
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete req.query[key];
      }
    }
  }
  next();
};


// Note: express-mongo-sanitize (in server.js) handles NoSQL injection prevention.
export const sanitizeInput = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value !== "string") return value;
    return value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };

  // Sensitive fields that must NOT be HTML-encoded (bcrypt hashes the raw value;
  // encoding chars like / > < " breaks password comparison).
  const SKIP_SANITIZE_KEYS = new Set(["password", "confirmPassword", "newPassword", "oldPassword"]);

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (SKIP_SANITIZE_KEYS.has(key)) continue; // never encode password fields
        if (typeof obj[key] === "string") obj[key] = sanitize(obj[key]);
        else if (typeof obj[key] === "object") sanitizeObject(obj[key]);
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
};

// ─── Security Headers ─────────────────────────────────────────────────────────
export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

// ─── Request Logger ───────────────────────────────────────────────────────────
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    if (res.statusCode >= 500) console.error(log);
    else if (res.statusCode >= 400) console.warn(log);
    else console.log(log);
  });
  next();
};
