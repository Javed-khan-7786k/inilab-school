import apiClient from "./apiClient";
import type { OnlineExamItem } from "../../types";

export const onlineExamApi = {
  async getAll(): Promise<OnlineExamItem[]> {
    const response = await apiClient.get("/online-exams");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<OnlineExamItem, "id">): Promise<OnlineExamItem> {
    const response = await apiClient.post("/online-exams", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<OnlineExamItem, "id">): Promise<OnlineExamItem> {
    const response = await apiClient.put(`/online-exams/${id}`, data);
    return response.data?.data || response.data;
  },

  async togglePublished(id: string | number): Promise<OnlineExamItem> {
    const response = await apiClient.patch(`/online-exams/${id}/toggle-published`);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/online-exams/${id}`);
  },
};
