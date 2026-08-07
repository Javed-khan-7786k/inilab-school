import express from "express";
import * as sectionController from "../controllers/sectionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(sectionController.getAll)
  .post(sectionController.create);

router.route("/:id")
  .get(sectionController.getById)
  .put(sectionController.update)
  .delete(sectionController.remove);

export default router;
