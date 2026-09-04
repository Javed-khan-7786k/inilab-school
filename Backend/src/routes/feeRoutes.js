import express from "express";
import {
  getFees,
  getFeeById,
  getFeeByStudentId,
  createFee,
  updateFee,
  deleteFee,
  getFeeStructure,
  updateFeeStructure,
  searchStudents,
  collectFeeAndGenerateReceipt,
  getReceipts,
  getReceiptById,
} from "../controllers/feeController.js";

const router = express.Router();

// Specific routes first to prevent conflict with /:id
router.route("/structure").get(getFeeStructure).put(updateFeeStructure);
router.get("/search-students", searchStudents);
router.post("/collect", collectFeeAndGenerateReceipt);
router.get("/receipts", getReceipts);
router.get("/receipts/:id", getReceiptById);
router.get("/student/:studentId", getFeeByStudentId);

// Base resource routes
router.route("/").get(getFees).post(createFee);
router.route("/:id").get(getFeeById).put(updateFee).delete(deleteFee);

export default router;
