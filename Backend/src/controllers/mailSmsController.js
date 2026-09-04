import MailSMS from "../models/MailSMS.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await MailSMS.find().sort({ createdAt: -1 }).lean();
  const data = items.map((item) => ({ ...item, id: item._id.toString() }));
  return ApiResponse.success(res, "Mail/SMS records fetched successfully", data);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await MailSMS.findById(req.params.id).lean();
  if (!item) {
    throw ApiError.notFound("Mail/SMS record not found");
  }
  return ApiResponse.success(res, "Mail/SMS record fetched successfully", { ...item, id: item._id.toString() });
});

export const create = asyncHandler(async (req, res) => {
  const doc = new MailSMS(req.body);
  await doc.save();
  return ApiResponse.created(res, "Mail/SMS sent successfully", { ...doc.toObject(), id: doc._id.toString() });
});

export const update = asyncHandler(async (req, res) => {
  const item = await MailSMS.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw ApiError.notFound("Mail/SMS record not found");
  }
  return ApiResponse.success(res, "Mail/SMS record updated successfully", { ...item.toObject(), id: item._id.toString() });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await MailSMS.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError.notFound("Mail/SMS record not found");
  }
  return ApiResponse.success(res, "Mail/SMS record deleted successfully");
});
