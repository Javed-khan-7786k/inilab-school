import apiClient from "./apiClient";
import type { ExamItem } from "../../types";

export const examApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<ExamItem[]> {
    const response = await apiClient.get("/exams", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<ExamItem> {
    const response = await apiClient.get(`/exams/${id}`);
    return response.data.data;
  },

  async create(examData: Omit<ExamItem, "id">): Promise<ExamItem> {
    const response = await apiClient.post("/exams", examData);
    return response.data.data;
  },

  async update(id: string | number, examData: Partial<ExamItem>): Promise<ExamItem> {
    const response = await apiClient.put(`/exams/${id}`, examData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/exams/${id}`);
  },
};
