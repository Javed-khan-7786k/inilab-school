import express from "express";
import * as gradeController from "../controllers/gradeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(gradeController.getAll)
  .post(gradeController.create);

router.route("/:id")
  .get(gradeController.getById)
  .put(gradeController.update)
  .delete(gradeController.remove);

export default router;
