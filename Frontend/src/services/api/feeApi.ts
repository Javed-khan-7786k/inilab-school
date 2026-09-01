import axios from "axios";
import type { FeeRecord } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: `${API_URL}/fees`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const feeApi = {
  getAll: async (params?: { className?: string; sectionName?: string }): Promise<FeeRecord[]> => {
    const res = await api.get("/", { params });
    return res.data.data;
  },

  getById: async (id: string | number): Promise<FeeRecord> => {
    const res = await api.get(`/${id}`);
    return res.data.data;
  },

  getByStudentId: async (studentId: string | number): Promise<FeeRecord> => {
    const res = await api.get(`/student/${studentId}`);
    return res.data.data;
  },

  create: async (data: Omit<FeeRecord, "id">): Promise<FeeRecord> => {
    const res = await api.post("/", data);
    return res.data.data;
  },

  update: async (id: string | number, data: Partial<FeeRecord>): Promise<FeeRecord> => {
    const res = await api.put(`/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
