import apiClient from "./apiClient";
import type { RoutineItem } from "../../types";

export const routineApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<RoutineItem[]> {
    const response = await apiClient.get("/routines", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<RoutineItem> {
    const response = await apiClient.get(`/routines/${id}`);
    return response.data.data;
  },

  async create(routineData: Omit<RoutineItem, "id">): Promise<RoutineItem> {
    const response = await apiClient.post("/routines", routineData);
    return response.data.data;
  },

  async update(id: string | number, routineData: Partial<RoutineItem>): Promise<RoutineItem> {
    const response = await apiClient.put(`/routines/${id}`, routineData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/routines/${id}`);
  },
};
