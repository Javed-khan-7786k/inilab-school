import noticeService from "../services/noticeService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const notices = await noticeService.getAll();
  return ApiResponse.success(res, "Notices fetched successfully", notices);
});

export const create = asyncHandler(async (req, res) => {
  const notice = await noticeService.create(req.body);
  return ApiResponse.created(res, "Notice created successfully", notice);
});

export const update = asyncHandler(async (req, res) => {
  const notice = await noticeService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Notice updated successfully", notice);
});

export const deleteNotice = asyncHandler(async (req, res) => {
  await noticeService.delete(req.params.id);
  return ApiResponse.success(res, "Notice deleted successfully");
});
