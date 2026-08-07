import type { SidebarEntry } from "../../constants/LibrariandashboardData";
import { getSidebarMenuItems } from "../../constants/navigation";

export const navigationApi = {
  async getNavigation(role: string): Promise<SidebarEntry[]> {
    // Return navigation data directly from frontend constants
    return getSidebarMenuItems(role);
  },
};
