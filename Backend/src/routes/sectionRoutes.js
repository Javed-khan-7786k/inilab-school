import express from "express";
import * as sectionController from "../controllers/sectionController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { sectionSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(sectionController.getAll)
  .post(joiValidate(sectionSchema), sectionController.create);

router.route("/:id")
  .get(sectionController.getById)
  .put(joiValidate(sectionSchema), sectionController.update)
  .delete(sectionController.remove);

export default router;
