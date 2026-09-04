import express from "express";
import * as hourlyTemplateController from "../controllers/hourlyTemplateController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(hourlyTemplateController.getAll)
  .post(hourlyTemplateController.create);

router.route("/:id")
  .get(hourlyTemplateController.getById)
  .put(hourlyTemplateController.update)
  .delete(hourlyTemplateController.remove);

export default router;
