import SalaryTemplate from "../models/SalaryTemplate.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await SalaryTemplate.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Salary templates fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await SalaryTemplate.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Salary template not found");
  }
  return ApiResponse.success(res, "Salary template fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new SalaryTemplate(req.body);
  await doc.save();
  return ApiResponse.created(res, "Salary template created successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await SalaryTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Salary template not found");
  }
  return ApiResponse.success(res, "Salary template updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await SalaryTemplate.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Salary template not found");
  }
  return ApiResponse.success(res, "Salary template deleted successfully");
});
