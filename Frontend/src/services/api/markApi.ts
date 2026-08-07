import apiClient from "./apiClient";
import type { MarkItem } from "../../types";

export const markApi = {
  async getAll(params?: { className?: string; examName?: string; sectionName?: string; subjectName?: string; search?: string; page?: number; limit?: number }): Promise<MarkItem[]> {
    const response = await apiClient.get("/marks", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<MarkItem> {
    const response = await apiClient.get(`/marks/${id}`);
    return response.data.data;
  },

  async saveBulk(records: Partial<MarkItem>[]): Promise<MarkItem[]> {
    const response = await apiClient.post("/marks/bulk", { records });
    return response.data.data;
  },

  async update(id: string | number, markData: Partial<MarkItem>): Promise<MarkItem> {
    const response = await apiClient.put(`/marks/${id}`, markData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/marks/${id}`);
  },
};
