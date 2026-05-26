import mongoose from "mongoose";

const authLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for failed attempts where user doesn't exist
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    action: {
      type: String,
      required: true,
      enum: ["signup", "login", "logout", "login_failed", "password_reset", "token_refresh"],
    },

    status: {
      type: String,
      required: true,
      enum: ["success", "failed"],
    },

    ipAddress: {
      type: String,
      default: "unknown",
    },

    userAgent: {
      type: String,
      default: "unknown",
    },

    failureReason: {
      type: String,
      default: null, // e.g. "wrong password", "user not found"
    },

    location: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for admin queries
authLogSchema.index({ userId: 1 });
authLogSchema.index({ email: 1 });
authLogSchema.index({ action: 1 });
authLogSchema.index({ status: 1 });
authLogSchema.index({ createdAt: -1 });

// Auto-delete logs older than 90 days
authLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.model("AuthLog", authLogSchema);
