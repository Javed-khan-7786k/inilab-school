import apiClient from "./apiClient";
import type { Student } from "../../types";

export const studentApi = {
  async getAll(params?: { search?: string; className?: string; page?: number; limit?: number }): Promise<Student[]> {
    const response = await apiClient.get("/students", { params });
    // In our backend API, the paginated data structure returns pagination and data array.
    // Let's check: Backend response returns data in response.data.data.
    return response.data.data;
  },

  async getById(id: string | number): Promise<Student> {
    const response = await apiClient.get(`/students/${id}`);
    return response.data.data;
  },

  async create(studentData: Omit<Student, "id">): Promise<Student> {
    const response = await apiClient.post("/students", studentData);
    return response.data.data;
  },

  async update(id: string | number, studentData: Partial<Student>): Promise<Student> {
    const response = await apiClient.put(`/students/${id}`, studentData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },
};
