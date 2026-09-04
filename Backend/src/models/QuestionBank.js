import mongoose from "mongoose";

const questionBankSchema = new mongoose.Schema(
  {
    difficultyLevel: {
      type: String,
      default: "Easy",
    },
    question: {
      type: String,
      required: true,
    },
    questionGroup: {
      type: String,
      default: "General",
    },
    questionType: {
      type: String,
      default: "Single Answer",
    },
    explanation: {
      type: String,
      default: "",
    },
    mark: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QuestionBank", questionBankSchema, "questionbanks");
