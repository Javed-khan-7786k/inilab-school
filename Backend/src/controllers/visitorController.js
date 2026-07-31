import visitorService from "../services/visitorService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const visitors = await visitorService.getAll();
  return ApiResponse.success(res, "Visitors fetched successfully", visitors);
});

export const create = asyncHandler(async (req, res) => {
  const visitor = await visitorService.create(req.body);
  return ApiResponse.created(res, "Visitor added successfully", visitor);
});

export const checkout = asyncHandler(async (req, res) => {
  const visitor = await visitorService.checkout(req.params.id);
  return ApiResponse.success(res, "Visitor checked out successfully", visitor);
});

export const deleteVisitor = asyncHandler(async (req, res) => {
  await visitorService.delete(req.params.id);
  return ApiResponse.success(res, "Visitor deleted successfully");
});
