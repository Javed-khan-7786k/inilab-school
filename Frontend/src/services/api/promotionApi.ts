import apiClient from "./apiClient";
import type { PromotionSettingItem } from "../../types";

export const promotionApi = {
  async getSetting(params?: { academicYear?: string; className?: string }): Promise<PromotionSettingItem> {
    const response = await apiClient.get("/promotions/setting", { params });
    return response.data.data;
  },

  async saveSetting(data: Partial<PromotionSettingItem>): Promise<PromotionSettingItem> {
    const response = await apiClient.post("/promotions/setting", data);
    return response.data.data;
  },
};
