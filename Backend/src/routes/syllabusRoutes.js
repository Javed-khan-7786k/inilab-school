import express from "express";
import * as syllabusController from "../controllers/syllabusController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(syllabusController.getAll)
  .post(syllabusController.create);

router.route("/:id")
  .get(syllabusController.getById)
  .put(syllabusController.update)
  .delete(syllabusController.remove);

export default router;
