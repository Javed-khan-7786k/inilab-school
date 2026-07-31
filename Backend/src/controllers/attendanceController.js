import attendanceService from "../services/attendanceService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getByDate = asyncHandler(async (req, res) => {
  const { date, className } = req.query;
  const targetDate = date || new Date().toISOString().split("T")[0];
  const records = await attendanceService.getByDate(targetDate, className);
  return ApiResponse.success(res, "Attendance fetched successfully", records);
});

export const getUserAttendance = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { month } = req.query; // YYYY-MM
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  const records = await attendanceService.getByUserAndMonth(type, id, targetMonth);
  return ApiResponse.success(res, "User attendance fetched successfully", records);
});

export const saveAttendance = asyncHandler(async (req, res) => {
  try {
    const { date, records } = req.body;
    const targetDate = date || new Date().toISOString().split("T")[0];
    const saved = await attendanceService.saveBatch(targetDate, records || [], req.user?._id);
    return ApiResponse.success(res, "Attendance saved successfully", saved);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

export const getStaffByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split("T")[0];
  const records = await attendanceService.getStaffByDate(targetDate);
  return ApiResponse.success(res, "Staff attendance fetched successfully", records);
});

export const saveStaffAttendance = asyncHandler(async (req, res) => {
  const { date, records } = req.body;
  const targetDate = date || new Date().toISOString().split("T")[0];
  const saved = await attendanceService.saveStaffBatch(targetDate, records || [], req.user);
  return ApiResponse.success(res, "Staff attendance saved successfully", saved);
});
