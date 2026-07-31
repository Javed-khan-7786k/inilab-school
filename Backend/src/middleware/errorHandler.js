import ApiError from "../utils/ApiError.js";
import multer from "multer";

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Multer errors (file too large, wrong type, etc.)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size exceeded";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = `Unexpected file field: ${err.field}`;
    } else {
      message = err.message;
    }
  }

  console.error(`[ERROR] ${statusCode} - ${message}`, err.isOperational ? "" : err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
  });
};

export default errorHandler;

