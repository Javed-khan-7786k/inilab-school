import mongoose from "mongoose";

const onlineExamSchema = new mongoose.Schema(
  {
    examTitle: {
      type: String,
      required: true,
      trim: true,
    },
    examStatus: {
      type: String,
      default: "Multiple Time",
    },
    date: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OnlineExam", onlineExamSchema, "onlineexams");
