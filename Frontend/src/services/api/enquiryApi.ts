import apiClient from "./apiClient";
import type { Enquiry } from "../../types";

export const enquiryApi = {
  async getAll(params?: { search?: string; status?: string; applyingClass?: string; page?: number; limit?: number }): Promise<Enquiry[]> {
    const response = await apiClient.get("/enquiries", { params });
    // In our backend API, paginated responses return data in response.data.data
    return response.data.data;
  },

  async getById(id: string | number): Promise<Enquiry> {
    const response = await apiClient.get(`/enquiries/${id}`);
    return response.data.data;
  },

  async create(enquiryData: Omit<Enquiry, "id">): Promise<Enquiry> {
    const response = await apiClient.post("/enquiries", enquiryData);
    return response.data.data;
  },

  async update(id: string | number, enquiryData: Partial<Enquiry>): Promise<Enquiry> {
    const response = await apiClient.put(`/enquiries/${id}`, enquiryData);
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/enquiries/${id}`);
  },
};
