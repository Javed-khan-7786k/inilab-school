import express from "express";
import { getAll, getById, create, update, deleteStudent } from "../controllers/studentController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { studentSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", joiValidate(studentSchema), create);
router.put("/:id", joiValidate(studentSchema), update);
router.delete("/:id", deleteStudent);

export default router;
