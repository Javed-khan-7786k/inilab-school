import examService from "../services/examService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await examService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Exams fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await examService.getById(req.params.id);
  return ApiResponse.success(res, "Exam fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await examService.create(req.body);
  return ApiResponse.created(res, "Exam created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await examService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Exam updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await examService.delete(req.params.id);
  return ApiResponse.success(res, "Exam deleted successfully");
});
