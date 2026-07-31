import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "https://demo.eduking.xyz/uploads/images/default.png" },
    name: { type: String, required: [true, "Teacher name is required"], trim: true },
    email: { type: String, trim: true, lowercase: true },
    designation: { type: String, required: [true, "Designation is required"], trim: true },
    infiniteDocuments: [{ name: { type: String }, file: { type: String } }],
  },
  { timestamps: true }
);

teacherSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

teacherSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
