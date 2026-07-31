import apiClient from "./apiClient";
import type { UserItem, ProfileDetails } from "../../types";

export const userApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<UserItem[]> {
    const response = await apiClient.get("/users", { params });
    return response.data.data;
  },

  async getById(id: string | number): Promise<UserItem> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },

  async getProfile(type: string, id: string | number): Promise<ProfileDetails> {
    const response = await apiClient.get(`/users/profile/${type}/${id}`);
    return response.data.data;
  },

  async create(userData: Omit<UserItem, "id">): Promise<UserItem> {
    const response = await apiClient.post("/users", userData);
    return response.data.data;
  },

  async update(id: string | number, userData: Partial<UserItem>): Promise<UserItem> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
