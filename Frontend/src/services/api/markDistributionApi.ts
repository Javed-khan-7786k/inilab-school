import apiClient from "./apiClient";
import type { MarkDistributionItem } from "../../types";

export const markDistributionApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<MarkDistributionItem[]> {
    const response = await apiClient.get("/mark-distributions", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<MarkDistributionItem> {
    const response = await apiClient.get(`/mark-distributions/${id}`);
    return response.data.data;
  },

  async create(data: Partial<MarkDistributionItem>): Promise<MarkDistributionItem> {
    const response = await apiClient.post("/mark-distributions", data);
    return response.data.data;
  },

  async update(id: string | number, data: Partial<MarkDistributionItem>): Promise<MarkDistributionItem> {
    const response = await apiClient.put(`/mark-distributions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/mark-distributions/${id}`);
  },
};
