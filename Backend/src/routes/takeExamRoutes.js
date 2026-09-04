import express from "express";
import * as takeExamController from "../controllers/takeExamController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(takeExamController.getAll)
  .post(takeExamController.create);

router.route("/:id")
  .get(takeExamController.getById)
  .put(takeExamController.update)
  .delete(takeExamController.remove);

export default router;
