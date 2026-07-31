import express from "express";
import { getAll, create, deleteDoc } from "../controllers/documentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", create);
router.delete("/:id", deleteDoc);

export default router;
