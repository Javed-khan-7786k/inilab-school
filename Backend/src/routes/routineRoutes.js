import express from "express";
import * as routineController from "../controllers/routineController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(routineController.getAll)
  .post(routineController.create);

router.route("/:id")
  .get(routineController.getById)
  .put(routineController.update)
  .delete(routineController.remove);

export default router;
