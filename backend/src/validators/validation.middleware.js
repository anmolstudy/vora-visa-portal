// ─── Helpers ─────────────────────────────────────────────────────────────────
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Minimum 8 chars, at least one letter and one number
const isStrongPassword = (password) =>
  password && password.length >= 8 ;

// ─── Validate Signup ──────────────────────────────────────────────────────────
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters");
  if (name && name.trim().length > 50) errors.push("Name cannot exceed 50 characters");
  if (!email || !isValidEmail(email)) errors.push("Please provide a valid email address");
  if (!password || !isStrongPassword(password)) {
    errors.push("Password must be at least 8 characters and contain a letter and a number");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

// ─── Validate Login ───────────────────────────────────────────────────────────
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) errors.push("Please provide a valid email address");
  if (!password) errors.push("Password is required");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

// ─── Validate Password Reset ──────────────────────────────────────────────────
export const validatePasswordReset = (req, res, next) => {
  const { newPassword } = req.body;
  const errors = [];

  if (!newPassword || !isStrongPassword(newPassword)) {
    errors.push("New password must be at least 8 characters and contain a letter and a number");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

// ─── Validate Status Update ───────────────────────────────────────────────────
export const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["active", "inactive", "suspended"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }
  next();
};
