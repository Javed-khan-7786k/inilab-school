import parentService from "../services/parentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await parentService.getAll(req.query);
  return ApiResponse.paginated(res, "Parents fetched successfully", result.data, result.page, result.limit, result.total);
});

export const getById = asyncHandler(async (req, res) => {
  const parent = await parentService.getById(req.params.id);
  return ApiResponse.success(res, "Parent fetched successfully", parent);
});

export const create = asyncHandler(async (req, res) => {
  const parent = await parentService.create(req.body);
  return ApiResponse.created(res, "Parent created successfully", parent);
});

export const update = asyncHandler(async (req, res) => {
  const parent = await parentService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Parent updated successfully", parent);
});

export const deleteParent = asyncHandler(async (req, res) => {
  await parentService.delete(req.params.id);
  return ApiResponse.success(res, "Parent deleted successfully");
});
