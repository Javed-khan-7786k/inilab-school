import express from "express";
import { getAll, getById, create, update, deleteEnquiry } from "../controllers/enquiryController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { enquirySchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", joiValidate(enquirySchema), create);
router.put("/:id", joiValidate(enquirySchema), update);
router.delete("/:id", deleteEnquiry);

export default router;
