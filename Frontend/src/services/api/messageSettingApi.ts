import apiClient from "./apiClient";

export interface MessageSettingData {
  id?: string;
  enabledMessageTypes: {
    notice: boolean;
    attendance: boolean;
    feeReminder: boolean;
    examUpdate: boolean;
    eventAlert: boolean;
    custom: boolean;
  };
  apiConfig: {
    provider: string;
    apiKey: string;
    apiSecret?: string;
    senderId: string;
    apiEndpoint: string;
    isActive: boolean;
  };
  autoSendTriggers: {
    autoSendOnAbsent: boolean;
    autoSendOnNotice: boolean;
    autoSendFeeDueDate: boolean;
  };
  templates: {
    attendanceAbsent: string;
    noticeAlert: string;
    feeReminder: string;
  };
}

export const messageSettingApi = {
  async getSettings(): Promise<MessageSettingData> {
    const response = await apiClient.get("/message-settings");
    return response.data.data;
  },

  async updateSettings(data: Partial<MessageSettingData>): Promise<MessageSettingData> {
    const response = await apiClient.post("/message-settings", data);
    return response.data.data;
  },

  async sendTestSMS(phone?: string, message?: string, type?: string): Promise<{ success: boolean; isSimulated?: boolean; message?: string }> {
    const response = await apiClient.post("/message-settings/test", { phone, message, type });
    return response.data.data;
  },
};
