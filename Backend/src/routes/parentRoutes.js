import express from "express";
import { getAll, getById, create, update, deleteParent } from "../controllers/parentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteParent);

export default router;
