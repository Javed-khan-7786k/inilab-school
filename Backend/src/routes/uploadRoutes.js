import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { imageUpload, handleMulterError } from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all upload routes

// POST /api/upload/image   (optional query: ?model=students&id=abc123)
router.post("/image", imageUpload, handleMulterError, uploadImage);

export default router;
