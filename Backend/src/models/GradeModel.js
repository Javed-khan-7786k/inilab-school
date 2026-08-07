import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    gradeName: {
      type: String,
      required: [true, "Grade name is required"],
      trim: true,
    },
    gradePoint: {
      type: String,
      required: [true, "Grade point is required"],
      trim: true,
    },
    markFrom: {
      type: Number,
      required: [true, "Mark from is required"],
    },
    markUpto: {
      type: Number,
      required: [true, "Mark upto is required"],
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const GradeModel = mongoose.model("Grade", gradeSchema);

export default GradeModel;
