import apiClient from "./apiClient";
import type { HourlyTemplateItem } from "../../types";

export const hourlyTemplateApi = {
  async getAll(): Promise<HourlyTemplateItem[]> {
    const response = await apiClient.get("/hourly-templates");
    return response.data?.data || response.data || [];
  },

  async getById(id: string | number): Promise<HourlyTemplateItem> {
    const response = await apiClient.get(`/hourly-templates/${id}`);
    return response.data?.data || response.data;
  },

  async create(data: Omit<HourlyTemplateItem, "id">): Promise<HourlyTemplateItem> {
    const response = await apiClient.post("/hourly-templates", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<HourlyTemplateItem, "id">): Promise<HourlyTemplateItem> {
    const response = await apiClient.put(`/hourly-templates/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/hourly-templates/${id}`);
  },
};
