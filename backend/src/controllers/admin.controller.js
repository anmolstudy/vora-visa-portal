import User from "../models/User.model.js";
import AuthLog from "../models/AuthLog.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import { AppError } from "../middleware/error.middleware.js";

// ─── Helper: Log Admin Activity ───────────────────────────────────────────────
const logActivity = async ({ userId, action, description, targetId, targetModel, metadata, req }) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      description,
      targetId: targetId || null,
      targetModel: targetModel || null,
      metadata: metadata || {},
      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown",
    });
  } catch (err) {
    console.error("Activity logging error:", err.message);
  }
};

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD STATS
═══════════════════════════════════════════════════════════════ */
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
      signupsLastMonth,
      totalLogins,
      failedLogins,
      recentSignups,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      AuthLog.countDocuments({ action: "login", status: "success" }),
      AuthLog.countDocuments({ action: "login_failed" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role status createdAt"),
    ]);

    const growthRate =
      signupsLastMonth > 0
        ? (((signupsThisMonth - signupsLastMonth) / signupsLastMonth) * 100).toFixed(1)
        : signupsThisMonth > 0
        ? 100
        : 0;

    // Monthly signup trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const signupTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          inactive: totalUsers - activeUsers - suspendedUsers,
        },
        signups: {
          today: signupsToday,
          thisWeek: signupsThisWeek,
          thisMonth: signupsThisMonth,
          lastMonth: signupsLastMonth,
          growthRate: Number(growthRate),
        },
        auth: {
          totalLogins,
          failedLogins,
        },
        recentSignups,
        signupTrend: signupTrend.map((item) => ({
          year: item._id.year,
          month: item._id.month,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   GET ALL USERS (with pagination & search)
═══════════════════════════════════════════════════════════════ */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users: users.map((u) => u.toPublicJSON()),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   GET SINGLE USER
═══════════════════════════════════════════════════════════════ */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   UPDATE USER STATUS
═══════════════════════════════════════════════════════════════ */
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError("You cannot change your own status", 400));
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save({ validateBeforeSave: false });

    await logActivity({
      userId: req.user._id,
      action: "update_user_status",
      description: `Changed user ${user.email} status from ${oldStatus} to ${status}`,
      targetId: user._id,
      targetModel: "User",
      metadata: { oldStatus, newStatus: status },
      req,
    });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   UPDATE USER ROLE
═══════════════════════════════════════════════════════════════ */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "employee"];

    if (!role || !validRoles.includes(role)) {
      return next(new AppError(`Role must be one of: ${validRoles.join(", ")}`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError("You cannot change your own role", 400));
    }

    const oldRole = user.role;
    user.role = role;
    await user.save({ validateBeforeSave: false });

    await logActivity({
      userId: req.user._id,
      action: "update_user_role",
      description: `Changed user ${user.email} role from ${oldRole} to ${role}`,
      targetId: user._id,
      targetModel: "User",
      metadata: { oldRole, newRole: role },
      req,
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   DELETE USER
═══════════════════════════════════════════════════════════════ */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError("You cannot delete your own account", 400));
    }

    await logActivity({
      userId: req.user._id,
      action: "delete_user",
      description: `Deleted user ${user.email} (${user.role})`,
      targetId: user._id,
      targetModel: "User",
      metadata: { deletedUser: { name: user.name, email: user.email, role: user.role } },
      req,
    });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   GET AUTH LOGS
═══════════════════════════════════════════════════════════════ */
export const getAuthLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const action = req.query.action || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    const query = {};
    if (action) query.action = action;
    if (status) query.status = status;

    const [logs, total] = await Promise.all([
      AuthLog.find(query)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuthLog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════
   GET ACTIVITY LOGS
═══════════════════════════════════════════════════════════════ */
export const getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      logs,
    });
  } catch (error) {
    next(error);
  }
};
