import apiClient from "./apiClient";
import type { SectionItem } from "../../types";

export const sectionApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<SectionItem[]> {
    const response = await apiClient.get("/sections", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<SectionItem> {
    const response = await apiClient.get(`/sections/${id}`);
    return response.data.data;
  },

  async create(sectionData: Omit<SectionItem, "id">): Promise<SectionItem> {
    const response = await apiClient.post("/sections", sectionData);
    return response.data.data;
  },

  async update(id: string | number, sectionData: Partial<SectionItem>): Promise<SectionItem> {
    const response = await apiClient.put(`/sections/${id}`, sectionData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/sections/${id}`);
  },
};
