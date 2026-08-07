import mongoose from "mongoose";

const examAttendanceSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
  },
  {
    timestamps: true,
  }
);

const ExamAttendanceModel = mongoose.model("ExamAttendance", examAttendanceSchema);

export default ExamAttendanceModel;
