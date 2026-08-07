import express from "express";
import * as markController from "../controllers/markController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(markController.getAll)
  .post(markController.saveBulk);

router.route("/bulk")
  .post(markController.saveBulk);

router.route("/:id")
  .get(markController.getById)
  .put(markController.update)
  .delete(markController.remove);

export default router;
