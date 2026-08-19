import express from "express";
import * as gradeController from "../controllers/gradeController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { gradeSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(gradeController.getAll)
  .post(joiValidate(gradeSchema), gradeController.create);

router.route("/:id")
  .get(gradeController.getById)
  .put(joiValidate(gradeSchema), gradeController.update)
  .delete(gradeController.remove);

export default router;
