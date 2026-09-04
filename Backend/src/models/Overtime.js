import mongoose from "mongoose";

const overtimeSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    hours: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    totalAmount: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Overtime", overtimeSchema, "overtimes");
