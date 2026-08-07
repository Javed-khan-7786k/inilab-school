import apiClient from "./apiClient";
import type { SubjectItem } from "../../types";

export const subjectApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<SubjectItem[]> {
    const response = await apiClient.get("/subjects", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<SubjectItem> {
    const response = await apiClient.get(`/subjects/${id}`);
    return response.data.data;
  },

  async create(subjectData: Omit<SubjectItem, "id">): Promise<SubjectItem> {
    const response = await apiClient.post("/subjects", subjectData);
    return response.data.data;
  },

  async update(id: string | number, subjectData: Partial<SubjectItem>): Promise<SubjectItem> {
    const response = await apiClient.put(`/subjects/${id}`, subjectData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`);
  },
};
