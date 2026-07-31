import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import ApiError from "../utils/ApiError.js";

// ─── Ensure upload directories exist ───────────────────────────────
const imageUploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

// ─── XLSX Upload — Memory Storage ──────────────────────────────────
const xlsxFileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".xlsx") {
    return cb(ApiError.badRequest("Only .xlsx files are allowed"), false);
  }
  cb(null, true);
};

export const xlsxUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: xlsxFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single("file");

// ─── Image Upload — Disk Storage ───────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imageUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  },
});

const imageFileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(ApiError.badRequest("Only JPG, PNG, and WEBP images are allowed"), false);
  }
  cb(null, true);
};

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");

// ─── Multer Error‑handler middleware ───────────────────────────────
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(ApiError.badRequest("File too large. Maximum size exceeded"));
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(ApiError.badRequest(`Unexpected file field: ${err.field}`));
    }
    return next(ApiError.badRequest(err.message));
  }
  next(err);
};
