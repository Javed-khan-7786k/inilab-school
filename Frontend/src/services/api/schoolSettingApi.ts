import apiClient from "./apiClient";

export const schoolSettingApi = {
  async getSettings() {
    const response = await apiClient.get("/school-settings");
    return response.data?.data;
  },

  async updateSettings(payload: any) {
    const response = await apiClient.put("/school-settings", payload);
    return response.data?.data;
  },

  async getStreams(grade?: string) {
    const response = await apiClient.get("/school-settings/streams", {
      params: grade ? { grade } : {},
    });
    return response.data?.data;
  },
};
