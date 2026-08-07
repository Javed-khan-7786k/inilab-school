import apiClient from "./apiClient";
import type { QuestionGroupItem } from "../../types";

export const questionGroupApi = {
  async getAll(): Promise<QuestionGroupItem[]> {
    const response = await apiClient.get("/question-groups");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<QuestionGroupItem, "id">): Promise<QuestionGroupItem> {
    const response = await apiClient.post("/question-groups", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<QuestionGroupItem, "id">): Promise<QuestionGroupItem> {
    const response = await apiClient.put(`/question-groups/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/question-groups/${id}`);
  },
};
