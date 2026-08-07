import express from "express";
import * as markDistributionController from "../controllers/markDistributionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/")
  .get(markDistributionController.getAll)
  .post(markDistributionController.create);

router.route("/:id")
  .get(markDistributionController.getById)
  .put(markDistributionController.update)
  .delete(markDistributionController.remove);

export default router;
