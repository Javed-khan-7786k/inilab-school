import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, "Student name is required"], trim: true },
    applyingClass: { type: String, required: [true, "Applying class is required"], trim: true },
    dob: { type: String, required: [true, "Date of birth is required"], trim: true },
    gender: { type: String, required: [true, "Gender is required"], trim: true },

    fatherName: { type: String, required: [true, "Father name is required"], trim: true },
    fatherOccupation: { type: String, required: [true, "Father occupation is required"], trim: true },
    fatherContact: { type: String, required: [true, "Father contact number is required"], trim: true },
    fatherEmail: { type: String, required: [true, "Father email ID is required"], trim: true },
    fatherAadhaar: { type: String, trim: true },

    motherName: { type: String, required: [true, "Mother name is required"], trim: true },
    motherOccupation: { type: String, required: [true, "Mother occupation is required"], trim: true },
    motherContact: { type: String, required: [true, "Mother contact number is required"], trim: true },
    motherEmail: { type: String, required: [true, "Mother email ID is required"], trim: true },
    motherAadhaar: { type: String, trim: true },

    address: { type: String, required: [true, "Address is required"], trim: true },
    state: { type: String, required: [true, "State is required"], trim: true },
    district: { type: String, required: [true, "District is required"], trim: true },
    pinCode: { type: String, required: [true, "PIN Code is required"], trim: true },

    childAadhaar: { type: String, trim: true },
    aparId: { type: String, trim: true },
    penNumber: { type: String, trim: true },

    previousSchool: { type: String, trim: true },
    previousSchoolAddress: { type: String, trim: true },
    previousSchoolId: { type: String, trim: true },
    lastClassAttended: { type: String, trim: true },

    photo: { type: String, default: "https://demo.eduking.xyz/uploads/images/default.png" },
    documents: [{ name: { type: String }, file: { type: String } }],
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Admission Confirmed", "Rejected", "Closed"],
      default: "New",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Format output: virtual id mapped from _id
enquirySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

enquirySchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
