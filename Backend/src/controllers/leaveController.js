import leaveService from "../services/leaveService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const leaves = await leaveService.getAll();
  return ApiResponse.success(res, "Leave applications fetched successfully", leaves);
});

export const create = asyncHandler(async (req, res) => {
  const leave = await leaveService.create(req.body);
  return ApiResponse.created(res, "Leave application submitted successfully", leave);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const leave = await leaveService.updateStatus(req.params.id, status);
  return ApiResponse.success(res, `Leave status updated to ${status}`, leave);
});

export const deleteLeave = asyncHandler(async (req, res) => {
  await leaveService.delete(req.params.id);
  return ApiResponse.success(res, "Leave application deleted successfully");
});
