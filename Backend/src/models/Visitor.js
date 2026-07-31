import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorId: { type: String, trim: true },
    name: { type: String, required: [true, "Visitor name is required"], trim: true },
    toMeet: { type: String, required: [true, "Person to meet is required"], trim: true },
    checkIn: { type: String },
    checkOut: { type: String, default: "" },
    status: {
      type: String,
      enum: ["in", "out"],
      default: "in",
    },
  },
  { timestamps: true }
);

visitorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

visitorSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
