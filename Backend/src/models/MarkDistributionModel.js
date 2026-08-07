import mongoose from "mongoose";

const markDistributionSchema = new mongoose.Schema(
  {
    markDistributionType: {
      type: String,
      required: [true, "Mark distribution type is required"],
      trim: true,
    },
    markValue: {
      type: Number,
      required: [true, "Mark value is required"],
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MarkDistributionModel = mongoose.model(
  "MarkDistribution",
  markDistributionSchema
);

export default MarkDistributionModel;
