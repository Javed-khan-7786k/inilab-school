import QuestionGroup from "../models/QuestionGroup.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await QuestionGroup.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Question groups fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await QuestionGroup.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Question group not found");
  }
  return ApiResponse.success(res, "Question group fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new QuestionGroup(req.body);
  await doc.save();
  return ApiResponse.created(res, "Question group created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await QuestionGroup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Question group not found");
  }
  return ApiResponse.success(res, "Question group updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await QuestionGroup.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Question group not found");
  }
  return ApiResponse.success(res, "Question group deleted successfully");
});
