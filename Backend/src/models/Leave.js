import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    applicationTo: { type: String, required: [true, "Recipient role/name is required"], trim: true },
    category: { type: String, required: [true, "Leave category is required"], trim: true },
    date: { type: String, required: [true, "Application date is required"], trim: true },
    schedule: { type: String, required: [true, "Schedule range is required"], trim: true },
    days: { type: Number, required: [true, "Total days count is required"], min: 1 },
    attachment: { type: String, default: "-" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

leaveSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

leaveSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
