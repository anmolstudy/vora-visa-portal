import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { AppError } from "./error.middleware.js";

// ─── Protect Route (verify JWT) ───────────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not authorized. No token provided.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB (in case it was deactivated)
    const user = await User.findById(decoded.id).select("+status");

    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    if (user.status === "suspended") {
      return next(new AppError("Your account has been suspended. Contact support.", 403));
    }

    if (user.status === "inactive") {
      return next(new AppError("Your account is inactive.", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Token is invalid or expired. Please login again.", 401));
  }
};

// ─── Authorize by Role ─────────────────────────────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
          403
        )
      );
    }

    next();
  };
};

// ─── Optional Auth (doesn't fail if no token) ─────────────────────────────────
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    req.user = null;
    next();
  }
};
