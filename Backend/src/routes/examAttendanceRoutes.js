import express from "express";
import * as examAttendanceController from "../controllers/examAttendanceController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { examAttendanceSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examAttendanceController.getAll)
  .post(joiValidate(examAttendanceSchema), examAttendanceController.saveBulk);

router.route("/bulk")
  .post(joiValidate(examAttendanceSchema), examAttendanceController.saveBulk);

router.route("/:id")
  .get(examAttendanceController.getById)
  .put(joiValidate(examAttendanceSchema), examAttendanceController.update)
  .delete(examAttendanceController.remove);

export default router;
