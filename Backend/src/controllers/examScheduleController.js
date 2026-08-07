import examScheduleService from "../services/examScheduleService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await examScheduleService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Exam schedules fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await examScheduleService.getById(req.params.id);
  return ApiResponse.success(res, "Exam schedule fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await examScheduleService.create(req.body);
  return ApiResponse.created(res, "Exam schedule created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await examScheduleService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Exam schedule updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await examScheduleService.delete(req.params.id);
  return ApiResponse.success(res, "Exam schedule deleted successfully");
});
