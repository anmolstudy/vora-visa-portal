import Demand from "../models/Demand.js";
import { AppError } from "../middleware/error.middleware.js";

// ─── CREATE DEMAND ────────────────────────────────────────────────────────────
export const createDemand = async (req, res, next) => {
  try {
    const { title, country, salary, description, deadline, status } = req.body;

    const newDemand = new Demand({
      title,
      country,
      salary,
      description,
      deadline,
      status: status || "draft",
      image: req.file ? req.file.filename : null,
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
};

// ─── GET ALL DEMANDS (with pagination) ───────────────────────────────────────
export const getAllDemands = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [demands, total] = await Promise.all([
      Demand.find({ isDeleted: false })
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Demand.countDocuments({ isDeleted: false }),
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
};

// ─── UPDATE DEMAND (allowlist only — no raw req.body) ────────────────────────
export const updateDemand = async (req, res, next) => {
  try {
    // Only allow safe fields — prevents injection of createdBy, isDeleted, etc.
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
};

// ─── SOFT DELETE DEMAND ───────────────────────────────────────────────────────
export const deleteDemand = async (req, res, next) => {
  try {
    const demand = await Demand.findByIdAndDelete(req.params.id);

    if (!demand) return next(new AppError("Demand not found", 404));

    res.status(200).json({ success: true, message: "Demand deleted successfully" });
  } catch (error) {
    next(error);
  }
};
