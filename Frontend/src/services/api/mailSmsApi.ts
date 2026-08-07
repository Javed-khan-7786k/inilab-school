import apiClient from "./apiClient";
import type { MailSMSItem } from "../../types";

export const mailSmsApi = {
  async getAll(): Promise<MailSMSItem[]> {
    const response = await apiClient.get("/mail-sms");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<MailSMSItem, "id">): Promise<MailSMSItem> {
    const response = await apiClient.post("/mail-sms", data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/mail-sms/${id}`);
  },
};
