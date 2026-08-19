import express from "express";
import { getAll, getById, create, update, deleteTeacher } from "../controllers/teacherController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { teacherSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", joiValidate(teacherSchema), create);
router.put("/:id", joiValidate(teacherSchema), update);
router.delete("/:id", deleteTeacher);

export default router;
