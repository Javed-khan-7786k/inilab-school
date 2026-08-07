import apiClient from "./apiClient";
import type { ExamScheduleItem } from "../../types";

export const examScheduleApi = {
  async getAll(params?: { className?: string; search?: string; page?: number; limit?: number }): Promise<ExamScheduleItem[]> {
    const response = await apiClient.get("/exam-schedules", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<ExamScheduleItem> {
    const response = await apiClient.get(`/exam-schedules/${id}`);
    return response.data.data;
  },

  async create(scheduleData: Omit<ExamScheduleItem, "id">): Promise<ExamScheduleItem> {
    const response = await apiClient.post("/exam-schedules", scheduleData);
    return response.data.data;
  },

  async update(id: string | number, scheduleData: Partial<ExamScheduleItem>): Promise<ExamScheduleItem> {
    const response = await apiClient.put(`/exam-schedules/${id}`, scheduleData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/exam-schedules/${id}`);
  },
};
