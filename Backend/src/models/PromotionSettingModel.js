import mongoose from "mongoose";

const promotionSettingSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    className: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    promotionAcademicYear: {
      type: String,
      required: [true, "Promotion academic year is required"],
      trim: true,
    },
    promotionClassName: {
      type: String,
      required: [true, "Promotion class is required"],
      trim: true,
    },
    promotionType: {
      type: String,
      enum: ["Normal", "Advance"],
      default: "Normal",
    },
    selectedExams: {
      type: [String],
      default: ["First Semester", "Second Semester", "Third Semester"],
    },
    subjectPassMarks: {
      type: Map,
      of: Number,
      default: {
        English: 33,
        Bangla: 33,
        Drawing: 33,
        "Math Matrix": 33,
        Science: 25,
        Math: 33,
        ICT: 33,
      },
    },
  },
  {
    timestamps: true,
  }
);

const PromotionSettingModel = mongoose.model(
  "PromotionSetting",
  promotionSettingSchema
);

export default PromotionSettingModel;
