import express from "express";
import * as classController from "../controllers/classController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { classSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(classController.getAll)
  .post(joiValidate(classSchema), classController.create);

router.route("/:id")
  .get(classController.getById)
  .put(joiValidate(classSchema), classController.update)
  .delete(classController.remove);

export default router;
