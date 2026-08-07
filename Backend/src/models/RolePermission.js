import mongoose from "mongoose";

const ModulePermissionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  canView: { type: Boolean, default: false },
  canAdd: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
  canExport: { type: Boolean, default: false },
});

const RolePermissionSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [ModulePermissionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("RolePermission", RolePermissionSchema);
