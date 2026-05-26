import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    category: {
      type: String,
      required: true,
    }, //  STATUS FIELD (VERY IMPORTANT)
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "filled", "draft"],
      default: "draft",
    },

    //  WHO CREATED THIS DEMAND
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // OPTIONAL EXPIRY DATE
    expiresAt: {
      type: Date,
    },

    // SOFT DELETE FIELD
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
