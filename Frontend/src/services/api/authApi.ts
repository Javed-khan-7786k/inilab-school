import apiClient from "./apiClient";

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: string;
    name: string;
    email: string;
    photo?: string;
  };
  token: string;
}

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", { username, password });
    return response.data.data;
  },

  async getMe(): Promise<unknown> {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },
};
