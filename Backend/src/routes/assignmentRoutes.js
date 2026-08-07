import express from "express";
import * as assignmentController from "../controllers/assignmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(assignmentController.getAll)
  .post(assignmentController.create);

router.route("/:id")
  .get(assignmentController.getById)
  .put(assignmentController.update)
  .delete(assignmentController.remove);

export default router;
