import express from "express";
import * as questionLevelController from "../controllers/questionLevelController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(questionLevelController.getAll)
  .post(questionLevelController.create);

router.route("/:id")
  .get(questionLevelController.getById)
  .put(questionLevelController.update)
  .delete(questionLevelController.remove);

export default router;
