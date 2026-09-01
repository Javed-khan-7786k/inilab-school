import { feeService } from "../services/feeService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getFees = asyncHandler(async (req, res) => {
  // Sync all students first so we always have a full list
  await feeService.syncAllStudentsFees();
  
  const filter = {};
  if (req.query.className) filter.className = req.query.className;
  if (req.query.sectionName) filter.sectionName = req.query.sectionName;

  const fees = await feeService.getAllFees(filter);
  res.status(200).json(new ApiResponse(200, "Fees retrieved successfully", fees));
});

export const getFeeById = asyncHandler(async (req, res) => {
  const fee = await feeService.getFeeById(req.params.id);
  res.status(200).json(new ApiResponse(200, "Fee retrieved successfully", fee));
});

export const getFeeByStudentId = asyncHandler(async (req, res) => {
  const fee = await feeService.getFeeByStudentId(req.params.studentId);
  res.status(200).json(new ApiResponse(200, "Fee retrieved successfully", fee));
});

export const createFee = asyncHandler(async (req, res) => {
  const fee = await feeService.createFee(req.body);
  res.status(201).json(new ApiResponse(201, "Fee created successfully", fee));
});

export const updateFee = asyncHandler(async (req, res) => {
  const fee = await feeService.updateFee(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, "Fee updated successfully", fee));
});

export const deleteFee = asyncHandler(async (req, res) => {
  await feeService.deleteFee(req.params.id);
  res.status(200).json(new ApiResponse(200, "Fee deleted successfully", null));
});
