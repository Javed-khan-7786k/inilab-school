import express from "express";
import { getAll, create, checkout, deleteVisitor } from "../controllers/visitorController.js";
import auth from "../middleware/auth.js";
import joiValidate from "../middleware/joiValidate.js";
import { visitorSchema } from "../validators/joiSchemas.js";

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", joiValidate(visitorSchema), create);
router.patch("/:id/checkout", checkout);
router.delete("/:id", deleteVisitor);

export default router;
