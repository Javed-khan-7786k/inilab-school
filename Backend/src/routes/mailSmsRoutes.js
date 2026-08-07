import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Mail & SMS service API", data: [] });
});

router.post("/", (req, res) => {
  res.json({ success: true, message: "Mail/SMS sent successfully", data: req.body });
});

export default router;
