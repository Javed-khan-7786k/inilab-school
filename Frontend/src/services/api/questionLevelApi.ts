import apiClient from "./apiClient";
import type { QuestionLevelItem } from "../../types";

export const questionLevelApi = {
  async getAll(): Promise<QuestionLevelItem[]> {
    const response = await apiClient.get("/question-levels");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<QuestionLevelItem, "id">): Promise<QuestionLevelItem> {
    const response = await apiClient.post("/question-levels", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<QuestionLevelItem, "id">): Promise<QuestionLevelItem> {
    const response = await apiClient.put(`/question-levels/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/question-levels/${id}`);
  },
};
