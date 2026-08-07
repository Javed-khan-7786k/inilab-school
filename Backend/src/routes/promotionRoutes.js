import express from "express";
import * as promotionController from "../controllers/promotionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/setting")
  .get(promotionController.getSetting)
  .post(promotionController.saveSetting);

export default router;
