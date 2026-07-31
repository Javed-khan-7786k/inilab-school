import MessageSetting from "../models/MessageSetting.js";

class SmsService {
  async getSettings() {
    let settings = await MessageSetting.findOne();
    if (!settings) {
      settings = await MessageSetting.create({});
    }
    return settings;
  }

  async sendSMS({ phone, message, type = "custom" }) {
    const settings = await this.getSettings();

    // 1. Check if specific message type is enabled
    if (settings.enabledMessageTypes && settings.enabledMessageTypes[type] === false) {
      console.log(`[SMS Service] Message type '${type}' is disabled in settings. Skipping dispatch.`);
      return { success: false, reason: `Message type '${type}' is disabled in settings.` };
    }

    const { apiConfig } = settings;

    // 2. Fallback to simulation log if live API sender is disabled or credentials missing
    if (!apiConfig.isActive || !apiConfig.apiKey) {
      console.log(`[SMS Service SIMULATION] To: ${phone} | Msg: ${message}`);
      return {
        success: true,
        isSimulated: true,
        message: `Simulated SMS sent to ${phone} (Live API active = ${apiConfig.isActive})`,
        content: message,
      };
    }

    // 3. Dispatch Live API Request
    try {
      let response;
      const { provider, apiKey, senderId, apiEndpoint } = apiConfig;

      if (provider === "Twilio") {
        // Twilio Basic Auth API
        const auth = Buffer.from(`${apiKey}:${apiConfig.apiSecret || ""}`).toString("base64");
        response = await fetch(apiEndpoint || `https://api.twilio.com/2010-04-01/Accounts/${apiKey}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: phone,
            From: senderId || "Twilio",
            Body: message,
          }),
        });
      } else if (provider === "MSG91") {
        response = await fetch(apiEndpoint || "https://api.msg91.com/api/v5/flow/", {
          method: "POST",
          headers: {
            "authkey": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: senderId,
            route: "4",
            country: "91",
            sms: [{ message, to: [phone] }],
          }),
        });
      } else {
        // Generic / Custom HTTP Gateway Endpoint
        response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: senderId,
            recipient: phone,
            message,
          }),
        });
      }

      const resData = await response.json().catch(() => ({}));
      return {
        success: response.ok,
        isSimulated: false,
        provider,
        response: resData,
        message: response.ok ? `Live SMS sent successfully via ${provider}` : `Provider error: ${response.statusText}`,
      };
    } catch (error) {
      console.error("[SMS Service Error]", error);
      return {
        success: false,
        error: error.message || "Failed to dispatch SMS via API provider",
      };
    }
  }

  async sendAbsenceAlert({ studentName, className, date, phone = "+919999999999" }) {
    const settings = await this.getSettings();
    if (!settings.autoSendTriggers.autoSendOnAbsent) {
      return { success: false, reason: "Auto-send on absent is disabled in Message Settings." };
    }

    let template = settings.templates?.attendanceAbsent || "Dear Parent, your child {student_name} of class {class_name} was marked ABSENT today ({date}).";
    template = template
      .replace("{student_name}", studentName || "Student")
      .replace("{class_name}", className || "General")
      .replace("{date}", date || new Date().toISOString().split("T")[0]);

    return this.sendSMS({ phone, message: template, type: "attendance" });
  }

  async sendNoticeAlert({ noticeTitle, date, phone = "+919999999999" }) {
    const settings = await this.getSettings();
    if (!settings.autoSendTriggers.autoSendOnNotice) {
      return { success: false, reason: "Auto-send on notice is disabled in Message Settings." };
    }

    let template = settings.templates?.noticeAlert || "School Notice: {notice_title}. Please check student portal for details.";
    template = template
      .replace("{notice_title}", noticeTitle || "New Announcement")
      .replace("{date}", date || new Date().toISOString().split("T")[0]);

    return this.sendSMS({ phone, message: template, type: "notice" });
  }
}

export default new SmsService();
