import subjectService from "../services/subjectService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await subjectService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Subjects fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await subjectService.getById(req.params.id);
  return ApiResponse.success(res, "Subject fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await subjectService.create(req.body);
  return ApiResponse.created(res, "Subject created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await subjectService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Subject updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await subjectService.delete(req.params.id);
  return ApiResponse.success(res, "Subject deleted successfully");
});
