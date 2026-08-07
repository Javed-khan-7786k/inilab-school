import apiClient from "./apiClient";
import type { SalaryTemplateItem } from "../../types";

export const salaryTemplateApi = {
  async getAll(): Promise<SalaryTemplateItem[]> {
    const response = await apiClient.get("/salary-templates");
    return response.data?.data || response.data || [];
  },

  async getById(id: string | number): Promise<SalaryTemplateItem> {
    const response = await apiClient.get(`/salary-templates/${id}`);
    return response.data?.data || response.data;
  },

  async create(data: Omit<SalaryTemplateItem, "id">): Promise<SalaryTemplateItem> {
    const response = await apiClient.post("/salary-templates", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<SalaryTemplateItem, "id">): Promise<SalaryTemplateItem> {
    const response = await apiClient.put(`/salary-templates/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/salary-templates/${id}`);
  },
};
