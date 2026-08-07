import routineService from "../services/routineService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await routineService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Routines fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await routineService.getById(req.params.id);
  return ApiResponse.success(res, "Routine fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await routineService.create(req.body);
  return ApiResponse.created(res, "Routine created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await routineService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Routine updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await routineService.delete(req.params.id);
  return ApiResponse.success(res, "Routine deleted successfully");
});
