import mongoose from "mongoose";

const hourlyTemplateSchema = new mongoose.Schema(
  {
    hourlyGrade: {
      type: String,
      required: true,
      trim: true,
    },
    hourlyRate: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HourlyTemplate", hourlyTemplateSchema, "hourlytemplates");
