import teacherService from "../services/teacherService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await teacherService.getAll(req.query);
  return ApiResponse.paginated(res, "Teachers fetched successfully", result.data, result.page, result.limit, result.total);
});

export const getById = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getById(req.params.id);
  return ApiResponse.success(res, "Teacher fetched successfully", teacher);
});

export const create = asyncHandler(async (req, res) => {
  const teacher = await teacherService.create(req.body);
  return ApiResponse.created(res, "Teacher created successfully", teacher);
});

export const update = asyncHandler(async (req, res) => {
  const teacher = await teacherService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Teacher updated successfully", teacher);
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  await teacherService.delete(req.params.id);
  return ApiResponse.success(res, "Teacher deleted successfully");
});
