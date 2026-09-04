import express from "express";
import * as mailSmsController from "../controllers/mailSmsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(mailSmsController.getAll)
  .post(mailSmsController.create);

router.route("/:id")
  .get(mailSmsController.getById)
  .put(mailSmsController.update)
  .delete(mailSmsController.remove);

export default router;
