import express from "express";
import * as examAttendanceController from "../controllers/examAttendanceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examAttendanceController.getAll)
  .post(examAttendanceController.saveBulk);

router.route("/bulk")
  .post(examAttendanceController.saveBulk);

router.route("/:id")
  .get(examAttendanceController.getById)
  .put(examAttendanceController.update)
  .delete(examAttendanceController.remove);

export default router;
