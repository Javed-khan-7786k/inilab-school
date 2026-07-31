import express from "express";
import authRoutes from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import parentRoutes from "./parentRoutes.js";
import userRoutes from "./userRoutes.js";
import visitorRoutes from "./visitorRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import eventRoutes from "./eventRoutes.js";
import holidayRoutes from "./holidayRoutes.js";
import leaveRoutes from "./leaveRoutes.js";
import documentRoutes from "./documentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import navigationRoutes from "./navigationRoutes.js";
import enquiryRoutes from "./enquiryRoutes.js";
import importRoutes from "./importRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";

import messageSettingRoutes from "./messageSettingRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/parents", parentRoutes);
router.use("/users", userRoutes);
router.use("/visitors", visitorRoutes);
router.use("/notices", noticeRoutes);
router.use("/events", eventRoutes);
router.use("/holidays", holidayRoutes);
router.use("/leaves", leaveRoutes);
router.use("/documents", documentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/navigation", navigationRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/import", importRoutes);
router.use("/upload", uploadRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/message-settings", messageSettingRoutes);

export default router;
