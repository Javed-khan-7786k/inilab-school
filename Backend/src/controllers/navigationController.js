import { getSidebarMenuItemsByRole } from "../constants/navigation.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getNavigationData = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const menuItems = getSidebarMenuItemsByRole(role);
  return ApiResponse.success(res, "Navigation menu fetched successfully", menuItems);
});
