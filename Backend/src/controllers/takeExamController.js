import TakeExam from "../models/TakeExam.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await TakeExam.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Take exam records fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await TakeExam.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Take exam record not found");
  }
  return ApiResponse.success(res, "Take exam record fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new TakeExam(req.body);
  await doc.save();
  return ApiResponse.created(res, "Take exam record created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await TakeExam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Take exam record not found");
  }
  return ApiResponse.success(res, "Take exam record updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await TakeExam.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Take exam record not found");
  }
  return ApiResponse.success(res, "Take exam record deleted successfully");
});
