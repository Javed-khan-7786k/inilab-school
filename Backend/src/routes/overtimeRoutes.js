import express from "express";
import * as overtimeController from "../controllers/overtimeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(overtimeController.getAll)
  .post(overtimeController.create);

router.route("/:id")
  .get(overtimeController.getById)
  .put(overtimeController.update)
  .delete(overtimeController.remove);

export default router;
