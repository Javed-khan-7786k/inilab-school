import apiClient from "./apiClient";
import type { GradeItem } from "../../types";

export const gradeApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<GradeItem[]> {
    const response = await apiClient.get("/grades", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<GradeItem> {
    const response = await apiClient.get(`/grades/${id}`);
    return response.data.data;
  },

  async create(gradeData: Omit<GradeItem, "id">): Promise<GradeItem> {
    const response = await apiClient.post("/grades", gradeData);
    return response.data.data;
  },

  async update(id: string | number, gradeData: Partial<GradeItem>): Promise<GradeItem> {
    const response = await apiClient.put(`/grades/${id}`, gradeData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/grades/${id}`);
  },
};
