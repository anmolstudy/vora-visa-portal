import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      // Aligned with validation.middleware.js (8 chars minimum)
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    phone: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // True when the account was auto-created via visa application flow.
    // Used to determine if it's safe to delete the account when the
    // visa application is removed (only if user has never logged in).
    autoCreated: {
      type: Boolean,
      default: false,
      select: false,
    },

    // Stores hashed password-reset token for one-time invalidation
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    // When password was last changed — used to invalidate reset tokens
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
// NOTE: In Mongoose 9 with async pre-save hooks, do NOT call next() —
// just return or throw. Calling next(err) in an async hook causes
// "next is not a function" because Mongoose resolves async hooks via
// the returned Promise, not the next callback.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) throw new Error("Password is required");
  this.password = await bcrypt.hash(this.password, 12);
  // Record when password was changed (used to invalidate old reset tokens)
  this.passwordChangedAt = new Date();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Return safe public profile (no sensitive fields)
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    phone: this.phone,
    avatar: this.avatar,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("User", userSchema);
