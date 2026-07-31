import apiClient from "./apiClient";
import type { Teacher } from "../../types";

export const teacherApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<Teacher[]> {
    const response = await apiClient.get("/teachers", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<Teacher> {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data.data;
  },

  async create(teacherData: Omit<Teacher, "id">): Promise<Teacher> {
    const response = await apiClient.post("/teachers", teacherData);
    return response.data.data;
  },

  async update(id: string | number, teacherData: Partial<Teacher>): Promise<Teacher> {
    const response = await apiClient.put(`/teachers/${id}`, teacherData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/teachers/${id}`);
  },
};
