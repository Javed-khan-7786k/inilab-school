import apiClient from "./apiClient";
import type { TakeExamItem } from "../../types";

export const takeExamApi = {
  async getAll(): Promise<TakeExamItem[]> {
    const response = await apiClient.get("/take-exams");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<TakeExamItem, "id">): Promise<TakeExamItem> {
    const response = await apiClient.post("/take-exams", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<TakeExamItem, "id">): Promise<TakeExamItem> {
    const response = await apiClient.put(`/take-exams/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/take-exams/${id}`);
  },
};
