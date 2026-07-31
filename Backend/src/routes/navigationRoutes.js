import express from "express";
import { getNavigationData } from "../controllers/navigationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:role", auth, getNavigationData);

export default router;
