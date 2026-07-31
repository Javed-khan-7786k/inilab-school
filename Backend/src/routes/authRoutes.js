import express from "express";
import { login, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/me", auth, getMe);

export default router;
