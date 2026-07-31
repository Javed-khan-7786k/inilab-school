import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Document title is required"], trim: true },
    date: { type: String, required: [true, "Document upload/issue date is required"], trim: true },
  },
  { timestamps: true }
);

documentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

documentSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
