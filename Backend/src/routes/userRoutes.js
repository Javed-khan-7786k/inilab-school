import express from "express";
import { getAll, getById, create, update, deleteUser, getProfile } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/profile/:type/:id", getProfile);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteUser);

export default router;
