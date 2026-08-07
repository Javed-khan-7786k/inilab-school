import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    deadline: {
      type: String,
      required: [true, "Deadline is required"],
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    sectionName: {
      type: String,
      trim: true,
      default: "",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    uploader: {
      type: String,
      default: "Admin",
    },
    file: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

export default AssignmentModel;
