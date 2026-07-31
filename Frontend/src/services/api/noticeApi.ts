import apiClient from "./apiClient";
import type { NoticeItem } from "../../types";

export const noticeApi = {
  async getAll(): Promise<NoticeItem[]> {
    const response = await apiClient.get("/notices");
    // console.log("all notices",response.data.data)
    return response.data.data;
  },

  async create(noticeData: Omit<NoticeItem, "id">): Promise<NoticeItem> {
    const response = await apiClient.post("/notices", noticeData);
    return response.data.data;
  },

  async update(id: string | number, noticeData: Partial<NoticeItem>): Promise<NoticeItem> {
    const response = await apiClient.put(`/notices/${id}`, noticeData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/notices/${id}`);
  },
};
