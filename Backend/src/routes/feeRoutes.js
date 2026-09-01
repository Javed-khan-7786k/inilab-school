import express from "express";
import {
  getFees,
  getFeeById,
  getFeeByStudentId,
  createFee,
  updateFee,
  deleteFee
} from "../controllers/feeController.js";

const router = express.Router();

router.route("/").get(getFees).post(createFee);
router.route("/:id").get(getFeeById).put(updateFee).delete(deleteFee);
router.route("/student/:studentId").get(getFeeByStudentId);

export default router;
