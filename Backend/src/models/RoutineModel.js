import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    schoolYear: {
      type: String,
      required: [true, "School year is required"],
      default: "2025-2026 (Default)",
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
    day: {
      type: String,
      required: [true, "Day is required"],
      trim: true,
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
    startingTime: {
      type: String,
      required: [true, "Starting time is required"],
    },
    endingTime: {
      type: String,
      required: [true, "Ending time is required"],
    },
    room: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoutineModel = mongoose.model("Routine", routineSchema);

export default RoutineModel;
