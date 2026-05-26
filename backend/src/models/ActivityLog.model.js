import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      // e.g. "update_user_status", "delete_user", "view_logs", "update_role"
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // ID of the resource being acted upon (if any)
    },

    targetModel: {
      type: String,
      default: null, // e.g. "User", "VisaApplication"
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Any extra info, e.g. { oldStatus: "active", newStatus: "suspended" }
    },

    ipAddress: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

// Auto-delete logs older than 180 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export default mongoose.model("ActivityLog", activityLogSchema);
