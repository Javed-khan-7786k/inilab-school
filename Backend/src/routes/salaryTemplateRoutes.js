import express from "express";
import * as salaryTemplateController from "../controllers/salaryTemplateController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(salaryTemplateController.getAll)
  .post(salaryTemplateController.create);

router.route("/:id")
  .get(salaryTemplateController.getById)
  .put(salaryTemplateController.update)
  .delete(salaryTemplateController.remove);

export default router;
