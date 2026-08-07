import syllabusService from "../services/syllabusService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await syllabusService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Syllabuses fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await syllabusService.getById(req.params.id);
  return ApiResponse.success(res, "Syllabus fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await syllabusService.create(req.body);
  return ApiResponse.created(res, "Syllabus created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await syllabusService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Syllabus updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await syllabusService.delete(req.params.id);
  return ApiResponse.success(res, "Syllabus deleted successfully");
});
