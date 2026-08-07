import assignmentService from "../services/assignmentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await assignmentService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Assignments fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await assignmentService.getById(req.params.id);
  return ApiResponse.success(res, "Assignment fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await assignmentService.create(req.body);
  return ApiResponse.created(res, "Assignment created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await assignmentService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Assignment updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await assignmentService.delete(req.params.id);
  return ApiResponse.success(res, "Assignment deleted successfully");
});
