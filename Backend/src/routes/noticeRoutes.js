import express from "express";
import { getAll, create, update, deleteNotice } from "../controllers/noticeController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { noticeSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", joiValidate(noticeSchema), create);
router.put("/:id", joiValidate(noticeSchema), update);
router.delete("/:id", deleteNotice);

export default router;
