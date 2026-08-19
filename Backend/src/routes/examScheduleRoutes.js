import express from "express";
import * as examScheduleController from "../controllers/examScheduleController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { examScheduleSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examScheduleController.getAll)
  .post(joiValidate(examScheduleSchema), examScheduleController.create);

router.route("/:id")
  .get(examScheduleController.getById)
  .put(joiValidate(examScheduleSchema), examScheduleController.update)
  .delete(examScheduleController.remove);

export default router;
