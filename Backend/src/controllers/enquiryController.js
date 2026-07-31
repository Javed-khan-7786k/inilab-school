import enquiryService from "../services/enquiryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await enquiryService.getAll(req.query);
  return ApiResponse.paginated(res, "Enquiries fetched successfully", result.data, result.page, result.limit, result.total);
});

export const getById = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.getById(req.params.id);
  return ApiResponse.success(res, "Enquiry fetched successfully", enquiry);
});

export const create = asyncHandler(async (req, res) => {
  // Pass req.user._id for createdBy property
  const enquiry = await enquiryService.create(req.body, req.user._id);
  return ApiResponse.created(res, "Enquiry created successfully", enquiry);
});

export const update = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Enquiry updated successfully", enquiry);
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  await enquiryService.delete(req.params.id);
  return ApiResponse.success(res, "Enquiry deleted successfully");
});
