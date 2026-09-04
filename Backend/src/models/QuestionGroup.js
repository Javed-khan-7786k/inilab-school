import mongoose from "mongoose";

const questionGroupSchema = new mongoose.Schema(
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

export default mongoose.model("QuestionGroup", questionGroupSchema, "questiongroups");
