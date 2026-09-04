import Instruction from "../models/Instruction.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await Instruction.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Instructions fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Instruction.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Instruction not found");
  }
  return ApiResponse.success(res, "Instruction fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new Instruction(req.body);
  await doc.save();
  return ApiResponse.created(res, "Instruction created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await Instruction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Instruction not found");
  }
  return ApiResponse.success(res, "Instruction updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Instruction.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Instruction not found");
  }
  return ApiResponse.success(res, "Instruction deleted successfully");
});
