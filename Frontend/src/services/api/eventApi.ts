import apiClient from "./apiClient";
import type { EventItem } from "../../types";

export const eventApi = {
  async getAll(): Promise<EventItem[]> {
    const response = await apiClient.get("/events");
    return response.data.data;
  },

  async create(eventData: Omit<EventItem, "id">): Promise<EventItem> {
    const response = await apiClient.post("/events", eventData);
    return response.data.data;
  },

  async update(id: string | number, eventData: Partial<EventItem>): Promise<EventItem> {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
