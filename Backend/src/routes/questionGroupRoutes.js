import express from "express";
import * as questionGroupController from "../controllers/questionGroupController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(questionGroupController.getAll)
  .post(questionGroupController.create);

router.route("/:id")
  .get(questionGroupController.getById)
  .put(questionGroupController.update)
  .delete(questionGroupController.remove);

export default router;
