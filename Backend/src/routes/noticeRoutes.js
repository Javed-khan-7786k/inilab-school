import express from "express";
import { getAll, create, update, deleteNotice } from "../controllers/noticeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteNotice);

export default router;
