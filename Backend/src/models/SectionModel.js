import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Section name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Academic",
    },
    capacity: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Capacity is required"],
      default: 40,
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
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SectionModel = mongoose.model("Section", sectionSchema);

export default SectionModel;
