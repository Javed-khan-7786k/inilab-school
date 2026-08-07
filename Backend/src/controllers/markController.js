import markService from "../services/markService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await markService.getAll(req.query);
  return ApiResponse.paginated(
    res,
    "Marks fetched successfully",
    result.data,
    result.page,
    result.limit,
    result.total
  );
});

export const getById = asyncHandler(async (req, res) => {
  const item = await markService.getById(req.params.id);
  return ApiResponse.success(res, "Mark fetched successfully", item);
});

export const saveBulk = asyncHandler(async (req, res) => {
  const records = req.body.records || req.body;
  const result = await markService.saveBulk(Array.isArray(records) ? records : [records]);
  return ApiResponse.success(res, "Marks saved successfully", result);
});

export const update = asyncHandler(async (req, res) => {
  const item = await markService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Mark updated successfully", item);
});

export const remove = asyncHandler(async (req, res) => {
  await markService.delete(req.params.id);
  return ApiResponse.success(res, "Mark deleted successfully");
});
