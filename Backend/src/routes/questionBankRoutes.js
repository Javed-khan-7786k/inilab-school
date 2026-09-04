import express from "express";
import * as questionBankController from "../controllers/questionBankController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(questionBankController.getAll)
  .post(questionBankController.create);

router.route("/:id")
  .get(questionBankController.getById)
  .put(questionBankController.update)
  .delete(questionBankController.remove);

export default router;
