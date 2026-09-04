import QuestionLevel from "../models/QuestionLevel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await QuestionLevel.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Question levels fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await QuestionLevel.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Question level not found");
  }
  return ApiResponse.success(res, "Question level fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new QuestionLevel(req.body);
  await doc.save();
  return ApiResponse.created(res, "Question level created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await QuestionLevel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Question level not found");
  }
  return ApiResponse.success(res, "Question level updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await QuestionLevel.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Question level not found");
  }
  return ApiResponse.success(res, "Question level deleted successfully");
});
