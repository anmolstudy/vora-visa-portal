import express from "express";
import crypto from "crypto";
import VisaApplication from "../models/VisaApplication.js";
import User from "../models/User.model.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

const router = express.Router();

// All visa routes require authentication + admin or employee role
router.use(protect, authorize("admin", "employee"));

// ──────────────────────────────────────────────
// POST /api/admin/visa/apply
// Create a new visa application AND a user account
// ──────────────────────────────────────────────
router.post("/apply", async (req, res, next) => {
  try {
    const { fullName, email, phone, visaType, country, message, password } = req.body;

    if (!fullName || !email || !phone || !visaType || !country) {
      return next(new AppError("Please fill all required fields.", 400));
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return next(new AppError("Invalid email address.", 400));
    }

    const newApplication = await VisaApplication.create({
      fullName,
      email,
      phone,
      visaType,
      country,
      message: message || "",
    });

    let user = await User.findOne({ email: email.toLowerCase() });
    let autoCreated = false;

    if (!user) {
      const safePassword = password || crypto.randomBytes(16).toString("hex");
      user = await User.create({
        name: fullName,
        email: email.toLowerCase(),
        password: safePassword,
        role: "user",
        autoCreated: true, // flag so we know it's safe to delete later
      });
      autoCreated = true;
    }

    res.status(201).json({
      success: true,
      message: "Visa application submitted successfully!",
      data: newApplication,
      userId: user._id,
      autoCreated,
    });
  } catch (error) {
    next(error);
  }
});

// ──────────────────────────────────────────────
// GET /api/admin/visa
// ──────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      VisaApplication.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      VisaApplication.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

// ──────────────────────────────────────────────
// GET /api/admin/visa/:id
// ──────────────────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const application = await VisaApplication.findById(req.params.id);
    if (!application) return next(new AppError("Application not found.", 404));
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// ──────────────────────────────────────────────
// PATCH /api/admin/visa/:id
// Full update — all editable fields
// ──────────────────────────────────────────────
router.patch("/:id", async (req, res, next) => {
  try {
    const ALLOWED = [
      "fullName", "email", "phone", "visaType", "country", "message",
      "status", "ppStatus", "ref", "payment", "paymentStatus", "ppExp", "subDate",
    ];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Auto-derive paymentStatus from payment amount if payment was updated
    if (updates.payment !== undefined && updates.paymentStatus === undefined) {
      updates.paymentStatus = Number(updates.payment) > 0 ? "PAID" : "PENDING";
    }

    const updated = await VisaApplication.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return next(new AppError("Application not found.", 404));
    res.status(200).json({ success: true, message: "Application updated successfully!", data: updated });
  } catch (error) {
    next(error);
  }
});

// ──────────────────────────────────────────────
// PATCH /api/admin/visa/:id/status
// ──────────────────────────────────────────────
router.patch("/:id/status", authorize("admin"), async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Processing", "Approved", "Rejected"];

    if (!status || !allowedStatuses.includes(status)) {
      return next(new AppError(`Status must be one of: ${allowedStatuses.join(", ")}`, 400));
    }

    const updated = await VisaApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) return next(new AppError("Application not found.", 404));

    res.status(200).json({ success: true, message: "Status updated successfully!", data: updated });
  } catch (error) {
    next(error);
  }
});

// ──────────────────────────────────────────────
// DELETE /api/admin/visa/:id  (admin only)
// Only deletes the linked user if they were auto-created for this application
// (loginCount === 0 and autoCreated flag). Real registered users are never deleted.
// ──────────────────────────────────────────────
router.delete("/:id", authorize("admin"), async (req, res, next) => {
  try {
    const application = await VisaApplication.findByIdAndDelete(req.params.id);
    if (!application) return next(new AppError("Application not found.", 404));

    // Only delete user if they were auto-created and have never actually logged in
    const linkedUser = await User.findOne({ email: application.email });
    if (linkedUser && linkedUser.autoCreated === true && (linkedUser.loginCount || 0) === 0) {
      await User.findByIdAndDelete(linkedUser._id);
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
