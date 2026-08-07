import examAttendanceService from "../services/examAttendanceService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await examAttendanceService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Exam attendances fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await examAttendanceService.getById(req.params.id);
  return ApiResponse.success(res, "Exam attendance fetched successfully", item);
});

export const saveBulk = asyncHandler(async (req, res) => {
  const records = req.body.records || req.body;
  const result = await examAttendanceService.saveBulk(Array.isArray(records) ? records : [records]);
  return ApiResponse.success(res, "Exam attendance saved successfully", result);
});

export const update = asyncHandler(async (req, res) => {
  const item = await examAttendanceService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Exam attendance updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await examAttendanceService.delete(req.params.id);
  return ApiResponse.success(res, "Exam attendance deleted successfully");
});
