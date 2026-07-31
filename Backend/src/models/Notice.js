import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Notice title is required"], trim: true },
    date: { type: String, required: [true, "Notice date is required"], trim: true },
    notice: { type: String, required: [true, "Notice body content is required"], trim: true },
    targetRoles: { type: [String], default: [] },
  },
  { timestamps: true }
);

noticeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

noticeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
