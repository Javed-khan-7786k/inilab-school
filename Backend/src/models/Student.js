import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "https://demo.eduking.xyz/uploads/images/default.png" },
    name: { type: String, required: [true, "Student name is required"], trim: true },
    roll: { type: String, required: [true, "Roll number is required"], trim: true },
    email: { type: String, trim: true, lowercase: true },
    className: { type: String, required: [true, "Class is required"], trim: true },

    // Extended admission profile (captured via the full Student form)
    dob: { type: String, trim: true },
    gender: { type: String, trim: true },

    fatherName: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    fatherContact: { type: String, trim: true },
    fatherEmail: { type: String, trim: true, lowercase: true },
    fatherAadhaar: { type: String, trim: true },

    motherName: { type: String, trim: true },
    motherOccupation: { type: String, trim: true },
    motherContact: { type: String, trim: true },
    motherEmail: { type: String, trim: true, lowercase: true },
    motherAadhaar: { type: String, trim: true },

    address: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    pinCode: { type: String, trim: true },

    childAadhaar: { type: String, trim: true },
    aparId: { type: String, trim: true },
    penNumber: { type: String, trim: true },

    previousSchool: { type: String, trim: true },
    previousSchoolAddress: { type: String, trim: true },
    previousSchoolId: { type: String, trim: true },
    lastClassAttended: { type: String, trim: true },
    documents: [{ name: { type: String }, file: { type: String } }],
  },
  { timestamps: true }
);

// Format output: virtual id mapped from _id
studentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

studentSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;