import express from "express";
import {
  createPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin routes — MUST be declared before /:id to avoid "admin" being treated as an ID
router.get("/admin/all", protect, authorize("admin"), getAllPayments);
router.put("/:id", protect, authorize("admin"), updatePayment);
router.delete("/:id", protect, authorize("admin"), deletePayment);

// User routes
router.post("/", protect, createPayment);
router.get("/my", protect, getMyPayments);
router.get("/:id", protect, getPaymentById);

export default router;
