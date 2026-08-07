import apiClient from "./apiClient";
import type { SyllabusItem } from "../../types";

export const syllabusApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<SyllabusItem[]> {
    const response = await apiClient.get("/syllabuses", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<SyllabusItem> {
    const response = await apiClient.get(`/syllabuses/${id}`);
    return response.data.data;
  },

  async create(syllabusData: Omit<SyllabusItem, "id">): Promise<SyllabusItem> {
    const response = await apiClient.post("/syllabuses", syllabusData);
    return response.data.data;
  },

  async update(id: string | number, syllabusData: Partial<SyllabusItem>): Promise<SyllabusItem> {
    const response = await apiClient.put(`/syllabuses/${id}`, syllabusData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/syllabuses/${id}`);
  },
};
