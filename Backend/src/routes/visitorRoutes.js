import express from "express";
import { getAll, create, checkout, deleteVisitor } from "../controllers/visitorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", create);
router.patch("/:id/checkout", checkout);
router.delete("/:id", deleteVisitor);

export default router;
