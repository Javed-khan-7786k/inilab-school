import mongoose from "mongoose";

const feeHeadSchema = new mongoose.Schema(
  {
    headName: { type: String, required: true },
    term: { type: String, required: true }, // "Monthly", "Annually", "Halfyearly", "Quarterly", "Onetime"
    defaultAmount: { type: Number, default: 0 },
    isTuition: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const classRateSchema = new mongoose.Schema(
  {
    className: { type: String, required: true }, // "Nursery", "LKG", "UKG", "One", "Two", etc.
    tuitionAmount: { type: Number, required: true },
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Standard School Fee Structure" },
    academicYear: { type: String, default: "2026-2027" },
    feeHeads: { type: [feeHeadSchema], default: [] },
    classRates: { type: [classRateSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

feeStructureSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

feeStructureSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
