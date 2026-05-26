import express from "express";
import path from "path";
import Demand from "../models/Demand.js";
import {
  createDemand,
  getAllDemands,
  updateDemand,
  deleteDemand,
} from "../controllers/demandController.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import upload, { handleUploadError } from "../middleware/uploadMiddleware.js";
import { AppError } from "../middleware/error.middleware.js";

const router = express.Router();

// ─── GET all demands (public — anyone can browse open demands) ────────────────
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

   
    const [demands, total] = await Promise.all([
      Demand.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Demand.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      demands,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET single demand ────────────────────────────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const demand = await Demand.findOne({ _id: req.params.id, isDeleted: false })
      .populate("createdBy", "name email role");
    if (!demand) return next(new AppError("Demand not found", 404));
    res.status(200).json({ success: true, demand });
  } catch (error) {
    next(error);
  }
});

// ─── Admin/Employee only routes ───────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin", "employee"),
  upload.single("image"),
  handleUploadError,
  async (req, res, next) => {
    try {
      const { title, country, salary, description, deadline } = req.body;

      if (!title || !country || !salary  || !deadline) {
        return next(new AppError("All fields are required", 400));
      }

      if (!req.file) {
        return next(new AppError("Image is required", 400));
      }

      const newDemand = new Demand({
        title,
        country,
        salary,
        description,
        deadline,
        image: req.file.filename,
        createdBy: req.user._id,
      });

      await newDemand.save();

      res.status(201).json({
        success: true,
        message: "Demand created successfully",
        demand: newDemand,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:id", protect, authorize("admin", "employee"), async (req, res, next) => {
  try {
    // Prevent arbitrary field injection — only allow safe fields
    const allowedFields = ["title", "country", "salary", "description", "deadline", "status"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const demand = await Demand.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!demand) return next(new AppError("Demand not found", 404));
    res.status(200).json({ success: true, demand });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, authorize("admin"), deleteDemand);

export default router;
