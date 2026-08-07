import apiClient from "./apiClient";
import type { InstructionItem } from "../../types";

export const instructionApi = {
  async getAll(): Promise<InstructionItem[]> {
    const response = await apiClient.get("/instructions");
    return response.data?.data || response.data || [];
  },

  async create(data: Omit<InstructionItem, "id">): Promise<InstructionItem> {
    const response = await apiClient.post("/instructions", data);
    return response.data?.data || response.data;
  },

  async update(id: string | number, data: Omit<InstructionItem, "id">): Promise<InstructionItem> {
    const response = await apiClient.put(`/instructions/${id}`, data);
    return response.data?.data || response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/instructions/${id}`);
  },
};
