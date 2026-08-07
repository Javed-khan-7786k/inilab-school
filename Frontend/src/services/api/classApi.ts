import apiClient from "./apiClient";
import type { ClassItem } from "../../types";

export const classApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<ClassItem[]> {
    const response = await apiClient.get("/classes", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<ClassItem> {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data.data;
  },

  async create(classData: Omit<ClassItem, "id">): Promise<ClassItem> {
    const response = await apiClient.post("/classes", classData);
    return response.data.data;
  },

  async update(id: string | number, classData: Partial<ClassItem>): Promise<ClassItem> {
    const response = await apiClient.put(`/classes/${id}`, classData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/classes/${id}`);
  },
};
