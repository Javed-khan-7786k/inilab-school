import express from "express";
import * as examController from "../controllers/examController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { examSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examController.getAll)
  .post(joiValidate(examSchema), examController.create);

router.route("/:id")
  .get(examController.getById)
  .put(joiValidate(examSchema), examController.update)
  .delete(examController.remove);

export default router;
