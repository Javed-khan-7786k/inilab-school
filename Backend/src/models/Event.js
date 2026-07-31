import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Event title is required"], trim: true },
    date: { type: String, required: [true, "Event date is required"], trim: true },
    details: { type: String, required: [true, "Event details content is required"], trim: true },
    targetRoles: { type: [String], default: [] },
  },
  { timestamps: true }
);

eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

eventSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
