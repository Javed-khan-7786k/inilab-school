import mongoose from "mongoose";

const messageSettingSchema = new mongoose.Schema(
  {
    enabledMessageTypes: {
      notice: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      feeReminder: { type: Boolean, default: true },
      examUpdate: { type: Boolean, default: true },
      eventAlert: { type: Boolean, default: true },
      custom: { type: Boolean, default: true },
    },
    apiConfig: {
      provider: { type: String, default: "Twilio" }, // Twilio, MSG91, Custom API, etc.
      apiKey: { type: String, default: "" },
      apiSecret: { type: String, default: "" },
      senderId: { type: String, default: "SCHOOL_SMS" },
      apiEndpoint: { type: String, default: "https://api.sms-provider.com/v1/send" },
      isActive: { type: Boolean, default: true },
    },
    autoSendTriggers: {
      autoSendOnAbsent: { type: Boolean, default: false },
      autoSendOnNotice: { type: Boolean, default: false },
      autoSendFeeDueDate: { type: Boolean, default: false },
    },
    templates: {
      attendanceAbsent: {
        type: String,
        default: "Dear Parent, your child {student_name} of class {class_name} was marked ABSENT today ({date}).",
      },
      noticeAlert: {
        type: String,
        default: "School Notice: {notice_title}. Please check student portal for details.",
      },
      feeReminder: {
        type: String,
        default: "Dear Parent, a fee installment for {student_name} is due on {due_date}. Amount: {amount}.",
      },
    },
  },
  { timestamps: true }
);

messageSettingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

messageSettingSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const MessageSetting = mongoose.model("MessageSetting", messageSettingSchema);
export default MessageSetting;
