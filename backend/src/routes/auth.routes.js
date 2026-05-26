import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/security.middleware.js";
import {
  validateSignup,
  validateLogin,
  validatePasswordReset,
} from "../validators/validation.middleware.js";

const router = express.Router();

// ─── Public routes (rate-limited) ────────────────────────────────────────────
router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, validateLogin, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, validatePasswordReset, resetPassword);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
