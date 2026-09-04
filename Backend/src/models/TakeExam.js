import mongoose from "mongoose";

const takeExamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    examStatus: {
      type: String,
      default: "Pending",
    },
    duration: {
      type: String,
      default: "30 Min",
    },
    date: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TakeExam", takeExamSchema, "takeexams");
