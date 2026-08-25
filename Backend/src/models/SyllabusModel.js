import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    },
    uploader: {
      type: String,
      required: [true, "Uploader name is required"],
      default: "Admin",
    },
    file: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const SyllabusModel = mongoose.model("Syllabus", syllabusSchema);

export default SyllabusModel;
