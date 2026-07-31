import apiClient from "./apiClient";
import type { Visitor } from "../../types";

export const visitorApi = {
  async getAll(): Promise<Visitor[]> {
    const response = await apiClient.get("/visitors");
    return response.data.data;
  },

  async create(name: string, toMeet: string, status: "in" | "out"): Promise<Visitor> {
    const response = await apiClient.post("/visitors", { name, toMeet, status });
    return response.data.data;
  },

  async checkout(id: string | number): Promise<Visitor> {
    const response = await apiClient.patch(`/visitors/${id}/checkout`);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/visitors/${id}`);
  },
};
