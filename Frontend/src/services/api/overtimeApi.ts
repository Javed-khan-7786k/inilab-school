import apiClient from "./apiClient";
import type { OvertimeItem } from "../../types";

export const overtimeApi = {
  async getAll(): Promise<OvertimeItem[]> {
    const response = await apiClient.get("/overtimes");
    return response.data?.data || response.data || [];
  },

  async getById(id: string | number): Promise<OvertimeItem> {
    const response = await apiClient.get(`/overtimes/${id}`);
    return response.data?.data || response.data;
  },

  async create(data: Omit<OvertimeItem, "id">): Promise<OvertimeItem> {
    const response = await apiClient.post("/overtimes", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<OvertimeItem, "id">): Promise<OvertimeItem> {
    const response = await apiClient.put(`/overtimes/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/overtimes/${id}`);
  },
};
