import express from "express";
import { getAll, getById, create, update, deleteTeacher } from "../controllers/teacherController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteTeacher);

export default router;
