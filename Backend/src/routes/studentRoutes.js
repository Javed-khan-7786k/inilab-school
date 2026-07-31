import express from "express";
import { getAll, getById, create, update, deleteStudent } from "../controllers/studentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all student routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteStudent);

export default router;
