import RolePermission from "../models/RolePermission.js";

const DEFAULT_MODULES = [
  { id: "1", name: "Student Management", category: "Users", canView: true, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "2", name: "Student Attendance", category: "Attendance", canView: true, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "3", name: "Exam Marks & Report Cards", category: "Examinations", canView: true, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "4", name: "Class Routines & Schedule", category: "Academic", canView: true, canAdd: false, canEdit: false, canDelete: false, canExport: true },
  { id: "5", name: "Fee Management & Payroll", category: "Accounts", canView: false, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "6", name: "Library Books Catalog", category: "Library", canView: true, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "7", name: "Front Desk & Visitors", category: "Reception", canView: false, canAdd: false, canEdit: false, canDelete: false, canExport: false },
  { id: "8", name: "System & School Settings", category: "System", canView: false, canAdd: false, canEdit: false, canDelete: false, canExport: false },
];

const STANDARD_ROLES = ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist"];

const getRoleDefaultPermissions = (roleName) => {
  return DEFAULT_MODULES.map((mod) => {
    if (roleName === "Admin") {
      return { ...mod, canView: true, canAdd: true, canEdit: true, canDelete: true, canExport: true };
    }
    if (roleName === "Teacher") {
      if (["Student Management", "Student Attendance", "Exam Marks & Report Cards"].includes(mod.name)) {
        return { ...mod, canView: true, canAdd: true, canEdit: true, canDelete: false, canExport: true };
      }
      return mod;
    }
    if (roleName === "Accountant") {
      if (mod.category === "Accounts" || mod.name === "Student Management") {
        return { ...mod, canView: true, canAdd: true, canEdit: true, canDelete: true, canExport: true };
      }
      return mod;
    }
    if (roleName === "Librarian") {
      if (mod.category === "Library" || mod.name === "Student Management") {
        return { ...mod, canView: true, canAdd: true, canEdit: true, canDelete: false, canExport: true };
      }
      return mod;
    }
    if (roleName === "Receptionist") {
      if (mod.category === "Reception" || mod.name === "Student Management") {
        return { ...mod, canView: true, canAdd: true, canEdit: true, canDelete: false, canExport: true };
      }
      return mod;
    }
    // Student & Parent (View only for relevant modules)
    return mod;
  });
};

export const getRolePermissions = async (req, res) => {
  try {
    let docs = await RolePermission.find().sort({ createdAt: 1 });

    if (docs.length === 0) {
      // Auto-seed all 7 standard roles into MongoDB
      const initialDocs = STANDARD_ROLES.map((r) => ({
        roleName: r,
        permissions: getRoleDefaultPermissions(r),
      }));
      docs = await RolePermission.insertMany(initialDocs);
    }

    // Ensure all 7 roles exist even if some were deleted
    const existingRoles = docs.map((d) => d.roleName);
    const missingRoles = STANDARD_ROLES.filter((r) => !existingRoles.includes(r));
    if (missingRoles.length > 0) {
      const missingDocs = missingRoles.map((r) => ({
        roleName: r,
        permissions: getRoleDefaultPermissions(r),
      }));
      const createdMissing = await RolePermission.insertMany(missingDocs);
      docs = [...docs, ...createdMissing];
    }

    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { roleName } = req.params;
    const { permissions } = req.body;

    let doc = await RolePermission.findOne({ roleName });
    if (!doc) {
      doc = new RolePermission({ roleName, permissions });
    } else {
      doc.permissions = permissions;
    }

    await doc.save();
    return res.status(200).json({ success: true, message: `Permissions for role ${roleName} saved to MongoDB!`, data: doc });
  } catch (error) {
    console.error("Error updating role permission:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    if (!roleName) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const existing = await RolePermission.findOne({ roleName: roleName.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Role "${roleName}" already exists` });
    }

    const newRole = await RolePermission.create({
      roleName: roleName.trim(),
      permissions: getRoleDefaultPermissions(roleName.trim()),
    });

    return res.status(201).json({ success: true, message: `Role "${roleName}" created in MongoDB!`, data: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
