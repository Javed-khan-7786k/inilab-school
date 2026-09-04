import express from "express";
import * as onlineExamController from "../controllers/onlineExamController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(onlineExamController.getAll)
  .post(onlineExamController.create);

router.patch("/:id/toggle-published", onlineExamController.togglePublished);

router.route("/:id")
  .get(onlineExamController.getById)
  .put(onlineExamController.update)
  .delete(onlineExamController.remove);

export default router;
