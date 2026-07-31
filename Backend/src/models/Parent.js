import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "https://demo.eduking.xyz/uploads/images/default.png" },
    name: { type: String, required: [true, "Parent name is required"], trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

parentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

parentSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;
