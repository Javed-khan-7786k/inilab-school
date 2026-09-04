import mongoose from "mongoose";

const feeItemSchema = new mongoose.Schema(
  {
    headName: { type: String, required: true }, // e.g., "Tution Fee", "Exam fee", "Bus Fee"
    term: { type: String, default: "Monthly" }, // "Monthly", "Annually", "Halfyearly", "Quarterly", "Onetime"
    period: { type: String, default: "" }, // e.g. "September 2026", "Term 1"
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const feeReceiptSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    roll: { type: String, required: true },
    className: { type: String, required: true },
    sectionName: { type: String, default: "A" },
    fatherName: { type: String, default: "" },
    academicYear: { type: String, default: "2026-2027" },
    schoolName: { type: String, default: "" },
    schoolAddress: { type: String, default: "" },
    schoolPhone: { type: String, default: "" },
    affiliationBoard: { type: String, default: "" },
    registrationNo: { type: String, default: "" },
    paymentDate: { type: Date, default: Date.now },
    items: { type: [feeItemSchema], required: true },
    subTotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    totalPaid: { type: Number, required: true },
    balanceDue: { type: Number, default: 0 },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI / Online", "Cheque", "Bank Transfer", "Card"],
      default: "Cash",
    },
    transactionId: { type: String, default: "" },
    remarks: { type: String, default: "" },
    collectedBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

feeReceiptSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

feeReceiptSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const FeeReceipt = mongoose.model("FeeReceipt", feeReceiptSchema);
export default FeeReceipt;
