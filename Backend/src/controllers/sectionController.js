import sectionService from "../services/sectionService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await sectionService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Sections fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await sectionService.getById(req.params.id);
  return ApiResponse.success(res, "Section fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await sectionService.create(req.body);
  return ApiResponse.created(res, "Section created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await sectionService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Section updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await sectionService.delete(req.params.id);
  return ApiResponse.success(res, "Section deleted successfully");
});
