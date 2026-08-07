import express from "express";
import * as classController from "../controllers/classController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(classController.getAll)
  .post(classController.create);

router.route("/:id")
  .get(classController.getById)
  .put(classController.update)
  .delete(classController.remove);

export default router;
