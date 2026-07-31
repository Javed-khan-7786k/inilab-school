import apiClient from "./apiClient";
import type { DocumentItem } from "../../types";

export const documentApi = {
  async getAll(): Promise<DocumentItem[]> {
    const response = await apiClient.get("/documents");
    return response.data.data;
  },

  async create(title: string, date?: string): Promise<DocumentItem> {
    const response = await apiClient.post("/documents", { title, date });
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },
};
