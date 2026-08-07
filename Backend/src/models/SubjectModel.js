import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: "",
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
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
    teacherName: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    passMark: {
      type: Number,
      required: [true, "Pass mark is required"],
      default: 33,
    },
    finalMark: {
      type: Number,
      required: [true, "Final mark is required"],
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

const SubjectModel = mongoose.model("Subject", subjectSchema);

export default SubjectModel;
