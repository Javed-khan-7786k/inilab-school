import studentService from "../services/studentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await studentService.getAll(req.query);
  return ApiResponse.paginated(res, "Students fetched successfully", result.data, result.page, result.limit, result.total);
});

export const getById = asyncHandler(async (req, res) => {
  const student = await studentService.getById(req.params.id);
  return ApiResponse.success(res, "Student fetched successfully", student);
});

export const create = asyncHandler(async (req, res) => {
  const student = await studentService.create(req.body);
  return ApiResponse.created(res, "Student created successfully", student);
});

export const update = asyncHandler(async (req, res) => {
  const student = await studentService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Student updated successfully", student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
  await studentService.delete(req.params.id);
  return ApiResponse.success(res, "Student deleted successfully");
});
