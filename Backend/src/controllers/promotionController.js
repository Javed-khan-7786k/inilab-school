import promotionService from "../services/promotionService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getSetting = asyncHandler(async (req, res) => {
  const result = await promotionService.getSetting(req.query);
  return ApiResponse.success(res, "Promotion setting fetched successfully", result);
});

export const saveSetting = asyncHandler(async (req, res) => {
  const result = await promotionService.saveSetting(req.body);
  return ApiResponse.success(res, "Promotion setting saved successfully", result);
});
