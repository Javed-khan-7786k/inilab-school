import OnlineExam from "../models/OnlineExam.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await OnlineExam.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Online exams fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await OnlineExam.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Online exam not found");
  }
  return ApiResponse.success(res, "Online exam fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new OnlineExam(req.body);
  await doc.save();
  return ApiResponse.created(res, "Online exam created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await OnlineExam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Online exam not found");
  }
  return ApiResponse.success(res, "Online exam updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const togglePublished = asyncHandler(async (req, res) => {
  const item = await OnlineExam.findById(req.params.id);
  if (!item) {
    throw ApiError.notFound("Online exam not found");
  }
  item.published = !item.published;
  await item.save();
  return ApiResponse.success(res, "Online exam status updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await OnlineExam.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Online exam not found");
  }
  return ApiResponse.success(res, "Online exam deleted successfully");
});
