import express from "express";
import {
  getSchoolSettings,
  updateSchoolSettings,
  getStreamsForClass,
} from "../controllers/schoolSettingController.js";

const router = express.Router();

router.get("/", getSchoolSettings);
router.put("/", updateSchoolSettings);
router.get("/streams", getStreamsForClass);

export default router;
