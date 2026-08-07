import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    roll: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    examMark: {
      type: Number,
      default: 0,
      min: 0,
      max: 70,
    },
    attendanceMark: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    classTestMark: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    assignmentMark: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    totalMark: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

markSchema.pre("save", function (next) {
  this.totalMark =
    (this.examMark || 0) +
    (this.attendanceMark || 0) +
    (this.classTestMark || 0) +
    (this.assignmentMark || 0);
  next();
});

const MarkModel = mongoose.model("Mark", markSchema);

export default MarkModel;
