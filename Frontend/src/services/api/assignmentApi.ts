import apiClient from "./apiClient";
import type { AssignmentItem } from "../../types";

export const assignmentApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<AssignmentItem[]> {
    const response = await apiClient.get("/assignments", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<AssignmentItem> {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data.data;
  },

  async create(assignmentData: Omit<AssignmentItem, "id">): Promise<AssignmentItem> {
    const response = await apiClient.post("/assignments", assignmentData);
    return response.data.data;
  },

  async update(id: string | number, assignmentData: Partial<AssignmentItem>): Promise<AssignmentItem> {
    const response = await apiClient.put(`/assignments/${id}`, assignmentData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};
