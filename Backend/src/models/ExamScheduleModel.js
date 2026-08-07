import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
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
      required: [true, "Section name is required"],
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
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    room: {
      type: String,
      required: [true, "Room is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExamScheduleModel = mongoose.model("ExamSchedule", examScheduleSchema);

export default ExamScheduleModel;
