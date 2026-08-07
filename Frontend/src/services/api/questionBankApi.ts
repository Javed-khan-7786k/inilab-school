import apiClient from "./apiClient";
import type { QuestionBankItem } from "../../types";

export const questionBankApi = {
  async getAll(): Promise<QuestionBankItem[]> {
    const response = await apiClient.get("/question-banks");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<QuestionBankItem, "id">): Promise<QuestionBankItem> {
    const response = await apiClient.post("/question-banks", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<QuestionBankItem, "id">): Promise<QuestionBankItem> {
    const response = await apiClient.put(`/question-banks/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/question-banks/${id}`);
  },
};
