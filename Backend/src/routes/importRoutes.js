import express from "express";
import { importExcel } from "../controllers/importController.js";
import { xlsxUpload, handleMulterError } from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all import routes

// POST /api/import/:entity  (entity = students | teachers | users)
router.post("/:entity", xlsxUpload, handleMulterError, importExcel);

export default router;
