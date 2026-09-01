import mongoose from "mongoose";

const feeMonthlyDetailSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    due: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    totalFee: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
    totalDue: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
    monthlyDetails: { type: [feeMonthlyDetailSchema], default: [] },
  },
  { timestamps: true }
);

// Format output: virtual id mapped from _id
feeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

feeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
