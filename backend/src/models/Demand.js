import mongoose from "mongoose";

const demandSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    country: { type: String, required: true },
    salary: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    deadline: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Demand", demandSchema);
