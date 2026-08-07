import classService from "../services/classService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await classService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Classes fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await classService.getById(req.params.id);
  return ApiResponse.success(res, "Class fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await classService.create(req.body);
  return ApiResponse.created(res, "Class created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await classService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Class updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await classService.delete(req.params.id);
  return ApiResponse.success(res, "Class deleted successfully");
});
