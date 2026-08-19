import express from "express";
import * as subjectController from "../controllers/subjectController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { subjectSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(subjectController.getAll)
  .post(joiValidate(subjectSchema), subjectController.create);

router.route("/:id")
  .get(subjectController.getById)
  .put(joiValidate(subjectSchema), subjectController.update)
  .delete(subjectController.remove);

export default router;
