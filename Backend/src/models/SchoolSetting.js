import mongoose from "mongoose";

const StreamSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String, default: "" },
  subjects: [{ type: String }],
});

const SessionSchema = new mongoose.Schema({
  id: { type: String },
  year: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  isActive: { type: Boolean, default: false },
});

const SchoolSettingSchema = new mongoose.Schema(
  {
    schoolProfile: {
      name: { type: String, default: "Inilab International Academy" },
      code: { type: String, default: "SCH-2026-INILAB" },
      registrationNo: { type: String, default: "REG-998877-CBSE" },
      affiliationBoard: { type: String, default: "CBSE Board" },
      establishmentYear: { type: String, default: "2008" },
      principalName: { type: String, default: "Dr. Parvej Alam" },
      address: { type: String, default: "123 Knowledge Park, Education Hub, New Delhi" },
      phone: { type: String, default: "+91 98765 43210" },
      email: { type: String, default: "contact@inilabacademy.edu.in" },
      currency: { type: String, default: "INR (₹)" },
    },
    sessions: [SessionSchema],
    availableStreams: [StreamSchema],
    classMultiStreams: {
      type: Map,
      of: [String],
      default: {
        "9": ["str-pcm", "str-pcb"],
        "10": ["str-pcm"],
        "11": ["str-pcm", "str-com", "str-art"],
        "12": ["str-pcm", "str-com"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SchoolSetting", SchoolSettingSchema);
