import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String, // Format: YYYY-MM-DD (e.g. 2026-07-23)
      required: [true, "Date is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Half Day"],
      default: "Present",
    },
    className: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound index for unique attendance per person per date
attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true, partialFilterExpression: { studentId: { $exists: true } } }
);
attendanceSchema.index(
  { teacherId: 1, date: 1 },
  { unique: true, partialFilterExpression: { teacherId: { $exists: true } } }
);
attendanceSchema.index(
  { userId: 1, date: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true } } }
);

attendanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

attendanceSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
