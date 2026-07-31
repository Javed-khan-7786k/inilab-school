import holidayService from "../services/holidayService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const holidays = await holidayService.getAll();
  return ApiResponse.success(res, "Holidays fetched successfully", holidays);
});

export const create = asyncHandler(async (req, res) => {
  const holiday = await holidayService.create(req.body);
  return ApiResponse.created(res, "Holiday created successfully", holiday);
});

export const update = asyncHandler(async (req, res) => {
  const holiday = await holidayService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Holiday updated successfully", holiday);
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  await holidayService.delete(req.params.id);
  return ApiResponse.success(res, "Holiday deleted successfully");
});
