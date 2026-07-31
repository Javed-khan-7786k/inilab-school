import apiClient from "./apiClient";
import type { HolidayItem } from "../../types";

export const holidayApi = {
  async getAll(): Promise<HolidayItem[]> {
    const response = await apiClient.get("/holidays");
    return response.data.data;
  },

  async create(holidayData: Omit<HolidayItem, "id">): Promise<HolidayItem> {
    const response = await apiClient.post("/holidays", holidayData);
    return response.data.data;
  },

  async update(id: string | number, holidayData: Partial<HolidayItem>): Promise<HolidayItem> {
    const response = await apiClient.put(`/holidays/${id}`, holidayData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/holidays/${id}`);
  },
};
