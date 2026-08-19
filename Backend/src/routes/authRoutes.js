import express from "express";
import { login, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import joiValidate from "../middleware/joiValidate.js";
import { authLoginSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.post("/login", loginLimiter, joiValidate(authLoginSchema), login);
router.get("/me", auth, getMe);

export default router;
