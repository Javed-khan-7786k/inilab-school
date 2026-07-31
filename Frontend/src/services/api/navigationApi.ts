import apiClient from "./apiClient";
import type { SidebarEntry } from "../../constants/LibrariandashboardData";

export const navigationApi = {
  async getNavigation(role: string): Promise<SidebarEntry[]> {
    const response = await apiClient.get(`/navigation/${role}`);
    // console.log("Navigation API response:", response.data); // Log the response data for debugging
    return response.data.data;
  },
};
