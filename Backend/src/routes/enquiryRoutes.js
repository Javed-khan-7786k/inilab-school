import express from "express";
import { getAll, getById, create, update, deleteEnquiry } from "../controllers/enquiryController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all routes with auth JWT middleware

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteEnquiry);

export default router;
