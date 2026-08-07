import express from "express";
import * as examController from "../controllers/examController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(examController.getAll)
  .post(examController.create);

router.route("/:id")
  .get(examController.getById)
  .put(examController.update)
  .delete(examController.remove);

export default router;
