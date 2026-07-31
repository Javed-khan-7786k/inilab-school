import apiClient from "./apiClient";
import type { LeaveApplication } from "../../types";

export const leaveApi = {
  async getAll(): Promise<LeaveApplication[]> {
    const response = await apiClient.get("/leaves");
    return response.data.data;
  },

  async apply(applyTo: string, category: string, schedule: string, daysCount: number): Promise<LeaveApplication> {
    const response = await apiClient.post("/leaves", {
      applicationTo: applyTo,
      category,
      schedule,
      days: daysCount,
    });
    return response.data.data;
  },

  async updateStatus(id: string | number, status: string): Promise<LeaveApplication> {
    const response = await apiClient.patch(`/leaves/${id}/status`, { status });
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/leaves/${id}`);
  },
};
