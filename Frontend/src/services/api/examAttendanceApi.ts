import apiClient from "./apiClient";
import type { ExamAttendanceItem } from "../../types";

export const examAttendanceApi = {
  async getAll(params?: { examName?: string; className?: string; sectionName?: string; subjectName?: string; search?: string; page?: number; limit?: number }): Promise<ExamAttendanceItem[]> {
    const response = await apiClient.get("/exam-attendances", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<ExamAttendanceItem> {
    const response = await apiClient.get(`/exam-attendances/${id}`);
    return response.data.data;
  },

  async saveBulk(records: Partial<ExamAttendanceItem>[]): Promise<ExamAttendanceItem[]> {
    const response = await apiClient.post("/exam-attendances/bulk", { records });
    return response.data.data;
  },

  async update(id: string | number, attendanceData: Partial<ExamAttendanceItem>): Promise<ExamAttendanceItem> {
    const response = await apiClient.put(`/exam-attendances/${id}`, attendanceData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/exam-attendances/${id}`);
  },
};
