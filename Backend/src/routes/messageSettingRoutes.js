import express from "express";
import { getMessageSettings, updateMessageSettings, sendTestSMS } from "../controllers/messageSettingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getMessageSettings);
router.post("/", updateMessageSettings);
router.post("/test", sendTestSMS);

export default router;
