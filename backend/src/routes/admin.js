import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAuthLogs,
  getActivityLogs,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Logs
router.get("/logs/auth", getAuthLogs);
router.get("/logs/activity", getActivityLogs);

export default router;
