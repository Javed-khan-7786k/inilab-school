import gradeService from "../services/gradeService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await gradeService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Grades fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await gradeService.getById(req.params.id);
  return ApiResponse.success(res, "Grade fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await gradeService.create(req.body);
  return ApiResponse.created(res, "Grade created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await gradeService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Grade updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await gradeService.delete(req.params.id);
  return ApiResponse.success(res, "Grade deleted successfully");
});
