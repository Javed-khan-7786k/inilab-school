import express from "express";
import * as examScheduleController from "../controllers/examScheduleController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examScheduleController.getAll)
  .post(examScheduleController.create);

router.route("/:id")
  .get(examScheduleController.getById)
  .put(examScheduleController.update)
  .delete(examScheduleController.remove);

export default router;
