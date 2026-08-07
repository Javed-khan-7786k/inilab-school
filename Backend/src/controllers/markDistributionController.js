import markDistributionService from "../services/markDistributionService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await markDistributionService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Mark distributions fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await markDistributionService.getById(req.params.id);
  return ApiResponse.success(res, "Mark distribution fetched successfully", item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await markDistributionService.create(req.body);
  return ApiResponse.created(res, "Mark distribution created successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await markDistributionService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Mark distribution updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await markDistributionService.delete(req.params.id);
  return ApiResponse.success(res, "Mark distribution deleted successfully");
});
