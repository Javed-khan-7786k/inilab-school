import express from "express";
import {
  getByDate,
  saveAttendance,
  getUserAttendance,
  getStaffByDate,
  saveStaffAttendance,
} from "../controllers/attendanceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all attendance routes

router.get("/", getByDate);
router.get("/staff", getStaffByDate);
router.post("/staff", saveStaffAttendance);
router.get("/user/:type/:id", getUserAttendance);
router.post("/", saveAttendance);

export default router;
