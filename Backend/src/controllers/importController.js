import importService from "../services/importService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const SUPPORTED_ENTITIES = ["students", "teachers", "users", "enquiries", "holidays"];

export const importExcel = asyncHandler(async (req, res) => {
  const { entity } = req.params;

  // Validate entity
  if (!SUPPORTED_ENTITIES.includes(entity)) {
    throw ApiError.badRequest(
      `Invalid entity: "${entity}". Supported: ${SUPPORTED_ENTITIES.join(", ")}`
    );
  }

  // Validate file was uploaded
  if (!req.file) {
    throw ApiError.badRequest("No file uploaded. Please upload an .xlsx file");
  }

  const result = await importService.importFromExcel(req.file.buffer, entity, req.user);

  return ApiResponse.success(res, `${entity} imported successfully`, result);
});
