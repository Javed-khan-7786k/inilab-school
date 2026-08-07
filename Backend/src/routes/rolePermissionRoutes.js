import express from "express";
import {
  getRolePermissions,
  updateRolePermissions,
  createRole,
} from "../controllers/rolePermissionController.js";

const router = express.Router();

router.get("/", getRolePermissions);
router.post("/", createRole);
router.put("/:roleName", updateRolePermissions);

export default router;
