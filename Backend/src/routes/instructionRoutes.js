import express from "express";
import * as instructionController from "../controllers/instructionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(instructionController.getAll)
  .post(instructionController.create);

router.route("/:id")
  .get(instructionController.getById)
  .put(instructionController.update)
  .delete(instructionController.remove);

export default router;
