import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    classNumeric: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Class numeric value is required"],
    },
    teacherName: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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

const ClassModel = mongoose.model("Class", classSchema);

export default ClassModel;
