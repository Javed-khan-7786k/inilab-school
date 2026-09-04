import mongoose from "mongoose";

const questionLevelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QuestionLevel", questionLevelSchema, "questionlevels");
