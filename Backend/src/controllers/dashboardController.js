import dashboardService from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const username = req.user.username;
  const data = await dashboardService.getDashboardData(role, username);
  return ApiResponse.success(res, "Dashboard data fetched successfully", data);
});
