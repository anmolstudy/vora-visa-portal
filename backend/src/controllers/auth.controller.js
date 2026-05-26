import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import AuthLog from "../models/AuthLog.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { AppError } from "../middleware/error.middleware.js";

// ─── Helper: Generate Access JWT ─────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });

// ─── Helper: Get IP Address (trust proxy-safe) ───────────────────────────────
const getIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  "unknown";

// ─── Helper: Log Auth Event ───────────────────────────────────────────────────
const logAuthEvent = async ({ userId, email, action, status, req, failureReason = null }) => {
  try {
    await AuthLog.create({
      userId,
      email,
      action,
      status,
      ipAddress: getIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      failureReason,
    });
  } catch (err) {
    // Log auth errors silently — never crash the main flow
    console.error("Auth logging error:", err.message);
  }
};

/* ═══════════════════════════════════════════════════════════════
   SIGNUP
═══════════════════════════════════════════════════════════════ */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // NOTE: role is intentionally NOT accepted from request body.
    // All new accounts default to "user". Admins are promoted via
    // the admin panel only — this prevents privilege escalation.

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await logAuthEvent({
        userId: existingUser._id,
        email,
        action: "signup",
        status: "failed",
        req,
        failureReason: "Email already registered",
      });
      return next(new AppError("User with this email already exists", 400));
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: "user", // Always default — never allow client to set role
    });

    await logAuthEvent({
      userId: user._id,
      email: user.email,
      action: "signup",
      status: "success",
      req,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════ */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password +status");

    if (!user) {
      await logAuthEvent({
        userId: null,
        email,
        action: "login_failed",
        status: "failed",
        req,
        failureReason: "User not found",
      });
      // Generic message — don't reveal whether email exists
      return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logAuthEvent({
        userId: user._id,
        email,
        action: "login_failed",
        status: "failed",
        req,
        failureReason: "Incorrect password",
      });
      return next(new AppError("Invalid email or password", 401));
    }

    if (user.status === "suspended") {
      return next(new AppError("Your account has been suspended. Contact support.", 403));
    }
    if (user.status === "inactive") {
      return next(new AppError("Your account is inactive.", 403));
    }

    // Persist login metadata — use updateOne to avoid triggering pre-save hooks
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), loginCount: (user.loginCount || 0) + 1 } }
    );

    await logAuthEvent({
      userId: user._id,
      email: user.email,
      action: "login",
      status: "success",
      req,
    });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════════════════════════ */
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await logAuthEvent({
        userId: req.user._id,
        email: req.user.email,
        action: "logout",
        status: "success",
        req,
      });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   GET ME
═══════════════════════════════════════════════════════════════ */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   FORGOT PASSWORD
═══════════════════════════════════════════════════════════════ */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return the same response — don't leak whether the email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Generate a short-lived reset token that encodes issuedAt
    // After password is reset, passwordChangedAt is updated, making
    // this token invalid even within its 15-min window (one-time use).
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password-reset", iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset your password",
      `<p>Hello ${user.name},</p>
       <p>Click the link below to reset your password. This link expires in 15 minutes and can only be used once.</p>
       <a href="${resetUrl}">${resetUrl}</a>
       <p>If you did not request this, please ignore this email.</p>`
    );

    res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   RESET PASSWORD
   Token is invalidated after use because saving a new password
   updates passwordChangedAt, and the token's iat will be before it.
═══════════════════════════════════════════════════════════════ */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return next(new AppError("Token and new password are required", 400));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(new AppError("Reset token is invalid or expired", 400));
    }

    // Ensure token was issued specifically for password reset
    if (decoded.purpose !== "password-reset") {
      return next(new AppError("Invalid reset token", 400));
    }

    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user) return next(new AppError("User not found", 404));

    // Check token wasn't already used (passwordChangedAt is set after each reset)
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat <= changedTimestamp) {
        return next(new AppError("Reset token has already been used. Please request a new one.", 400));
      }
    }

    user.password = newPassword; // hashed by pre-save hook; pre-save also sets passwordChangedAt
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
