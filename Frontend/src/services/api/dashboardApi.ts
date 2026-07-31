import apiClient from "./apiClient";

export interface DashboardData {
  profileUser: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  profileDetails: Array<{ icon: string; label: string; value: string }>;
  infoBoxes: Array<{ value: number; label: string; icon: string; bgColor: string }>;
  notices: Array<{ id: string | number; title: string; description: string; actionHref: string }>;
  calendarMonth: string;
  calendarYear: number;
  calendarTodayDate: number;
  calendarDayNames: string[];
  calendarWeeks: Array<Array<{ day: number; isOtherMonth?: boolean; isToday?: boolean }>>;
}

export const dashboardApi = {
  async getDashboard(role: string): Promise<DashboardData> {
    const response = await apiClient.get(`/dashboard/${role}`);
    // console.log("Dashboard API response:", response.data); // Log the response data for debugging
    return response.data.data;
  },
};
