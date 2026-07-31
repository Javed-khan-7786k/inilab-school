import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Holiday title is required"], trim: true },
    date: { type: String, required: [true, "Holiday date range is required"], trim: true },
    details: { type: String, required: [true, "Holiday details are required"], trim: true },
  },
  { timestamps: true }
);

holidaySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

holidaySchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Holiday = mongoose.model("Holiday", holidaySchema);
export default Holiday;
