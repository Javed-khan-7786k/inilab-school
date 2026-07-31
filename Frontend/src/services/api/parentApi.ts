import apiClient from "./apiClient";
import type { Parent } from "../../types";

export const parentApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<Parent[]> {
    const response = await apiClient.get("/parents", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<Parent> {
    const response = await apiClient.get(`/parents/${id}`);
    return response.data.data;
  },

  async create(parentData: Omit<Parent, "id">): Promise<Parent> {
    const response = await apiClient.post("/parents", parentData);
    return response.data.data;
  },

  async update(id: string | number, parentData: Partial<Parent>): Promise<Parent> {
    const response = await apiClient.put(`/parents/${id}`, parentData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/parents/${id}`);
  },
};
