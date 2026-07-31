import eventService from "../services/eventService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAll = asyncHandler(async (req, res) => {
  const events = await eventService.getAll();
  return ApiResponse.success(res, "Events fetched successfully", events);
});

export const create = asyncHandler(async (req, res) => {
  const event = await eventService.create(req.body);
  return ApiResponse.created(res, "Event created successfully", event);
});

export const update = asyncHandler(async (req, res) => {
  const event = await eventService.update(req.params.id, req.body);
  return ApiResponse.success(res, "Event updated successfully", event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.delete(req.params.id);
  return ApiResponse.success(res, "Event deleted successfully");
});
