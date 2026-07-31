import MessageSetting from "../models/MessageSetting.js";
import smsService from "../services/smsService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMessageSettings = asyncHandler(async (req, res) => {
  let settings = await MessageSetting.findOne();
  if (!settings) {
    settings = await MessageSetting.create({});
  }
  return ApiResponse.success(res, "Message settings retrieved successfully", settings);
});

export const updateMessageSettings = asyncHandler(async (req, res) => {
  let settings = await MessageSetting.findOne();
  if (settings) {
    settings.enabledMessageTypes = { ...settings.enabledMessageTypes, ...(req.body.enabledMessageTypes || {}) };
    settings.apiConfig = { ...settings.apiConfig, ...(req.body.apiConfig || {}) };
    settings.autoSendTriggers = { ...settings.autoSendTriggers, ...(req.body.autoSendTriggers || {}) };
    settings.templates = { ...settings.templates, ...(req.body.templates || {}) };
    await settings.save();
  } else {
    settings = await MessageSetting.create(req.body);
  }
  return ApiResponse.success(res, "Message settings updated successfully", settings);
});

export const sendTestSMS = asyncHandler(async (req, res) => {
  const { phone, message, type } = req.body;
  const result = await smsService.sendSMS({
    phone: phone || "+919876543210",
    message: message || "School SMS API Test: Configuration is active and working!",
    type: type || "custom",
  });
  return ApiResponse.success(res, "Test message request processed", result);
});
