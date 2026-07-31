import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

const modelMap = {
  students: Student,
  teachers: Teacher,
  users: User,
};

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("No image uploaded");
  }

  // Build public URL
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/images/${req.file.filename}`;

  // Optionally attach to an existing document: ?model=students&id=abc123
  const { model: modelName, id } = req.query;

  if (modelName && id) {
    const Model = modelMap[modelName];
    if (!Model) {
      throw ApiError.badRequest(
        `Invalid model: "${modelName}". Supported: ${Object.keys(modelMap).join(", ")}`
      );
    }

    const doc = await Model.findByIdAndUpdate(
      id,
      { photo: imageUrl },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw ApiError.notFound(`${modelName} document with id "${id}" not found`);
    }

    return ApiResponse.success(res, "Image uploaded and document updated", {
      imageUrl,
      document: doc,
    });
  }

  // No model/id — just return the URL
  return ApiResponse.success(res, "Image uploaded successfully", { imageUrl });
});
