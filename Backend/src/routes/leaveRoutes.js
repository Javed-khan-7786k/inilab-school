import express from "express";
import { getAll, create, updateStatus, deleteLeave } from "../controllers/leaveController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", create);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteLeave);

export default router;
