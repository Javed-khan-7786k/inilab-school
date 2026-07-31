import documentService from "../services/documentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const documents = await documentService.getAll();
  return ApiResponse.success(res, "Documents fetched successfully", documents);
});

export const create = asyncHandler(async (req, res) => {
  const doc = await documentService.create(req.body);
  return ApiResponse.created(res, "Document uploaded successfully", doc);
});

export const deleteDoc = asyncHandler(async (req, res) => {
  await documentService.delete(req.params.id);
  return ApiResponse.success(res, "Document deleted successfully");
});
