import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { useLanguage } from "../../context/LanguageContext";
import { rolePermissionApi, type PermissionModule } from "../../services/api/rolePermissionApi";

export function UsersPermissionPage() {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<string>("Teacher");
  const [roles, setRoles] = useState<string[]>([
    "Admin",
    "Teacher",
    "Student",
    "Parent",
    "Accountant",
    "Librarian",
    "Receptionist",
  ]);

  const [permissionsMap, setPermissionsMap] = useState<Record<string, PermissionModule[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch permissions from MongoDB backend on mount
  const fetchRolePermissions = async () => {
    setLoading(true);
    try {
      const data = await rolePermissionApi.getAll();
      if (data && data.length > 0) {
        const roleNamesList: string[] = [];
        const pMap: Record<string, PermissionModule[]> = {};

        data.forEach((item) => {
          roleNamesList.push(item.roleName);
          pMap[item.roleName] = item.permissions;
        });

        // Ensure standard roles exist in list
        const standardDefaults = ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist"];
        standardDefaults.forEach((r) => {
          if (!roleNamesList.includes(r)) roleNamesList.push(r);
        });

        setRoles(roleNamesList);
        setPermissionsMap(pMap);

        if (!roleNamesList.includes(selectedRole)) {
          setSelectedRole(roleNamesList[0] || "Admin");
        }
      }
    } catch (err: any) {
      console.warn("Backend permissions load warning:", err);
      showNotification("Notice: Operating with cached permission defaults", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const activePermissions: PermissionModule[] = permissionsMap[selectedRole] || [];

  const handleTogglePermission = (id: string, field: keyof Omit<PermissionModule, "id" | "name" | "category">) => {
    setPermissionsMap((prev) => {
      const currentList = prev[selectedRole] || [];
      const updatedList = currentList.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      );
      return {
        ...prev,
        [selectedRole]: updatedList,
      };
    });
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const cleanRole = newRoleName.trim();
    try {
      const created = await rolePermissionApi.createRole(cleanRole);
      setRoles((prev) => (prev.includes(cleanRole) ? prev : [...prev, cleanRole]));
      setPermissionsMap((prev) => ({
        ...prev,
        [cleanRole]: created.permissions,
      }));
      setSelectedRole(cleanRole);
      showNotification(`Role "${cleanRole}" created and saved to MongoDB!`);
      setNewRoleName("");
      setShowAddRoleForm(false);
    } catch (err: any) {
      showNotification(err.message || "Failed to create new role", "error");
    }
  };

  const handleSaveMatrix = async () => {
    setSaving(true);
    try {
      const currentList = permissionsMap[selectedRole] || [];
      await rolePermissionApi.updateRolePermission(selectedRole, currentList);
      showNotification(`Permissions for role "${selectedRole}" saved to database successfully!`);
    } catch (err: any) {
      showNotification(err.message || "Failed to save permissions", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeaderBar
          titleKey="Users & Permission Settings"
          iconName="fa-users"
          breadcrumbLabel="Users & Permission"
          rightContent={
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddRoleForm(!showAddRoleForm)}
                className="bg-teal text-white"
              >
                <Icon name="fa-plus" className="mr-1" />
                <span>{showAddRoleForm ? t("Cancel") : t("Add Role")}</span>
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleSaveMatrix}
                disabled={saving}
                className="bg-teal text-white font-bold"
              >
                <Icon name="fa-save" className="mr-1" />
                <span>{saving ? t("Saving to DB...") : t("Save Permissions")}</span>
              </Button>
            </div>
          }
        />

        {toast && (
          <div
            className={`p-3 rounded text-xs font-semibold flex items-center gap-2 border ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} />
            <span>{toast.message}</span>
          </div>
        )}

        {showAddRoleForm && (
          <form
            onSubmit={handleAddRole}
            className="animate-field-expand bg-[#fafafa] p-4 rounded border border-[#e7eaec] space-y-4"
          >
            <div className="text-xs font-bold text-teal uppercase tracking-wider">
              {t("Create New User Role")}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter role title (e.g. Supervisor, Auditor)"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  requiredField
                />
              </div>
              <Button type="submit" variant="success" size="sm" className="mt-5">
                {t("Save Role")}
              </Button>
            </div>
          </form>
        )}

        <div className="bg-white p-6 rounded shadow-sm border border-[#e7eaec] space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider">
                {t("Select System Role to Manage Permissions Matrix:")}
              </label>
              <span className="text-[11px] text-teal font-semibold">
                MongoDB Synced Role: <span className="font-bold uppercase underline">{selectedRole}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    selectedRole === role
                      ? "bg-teal text-white border-teal shadow-sm"
                      : "bg-[#f8f9fa] text-dark border-[#dfe6e9] hover:bg-gray-100"
                  }`}
                >
                  <Icon name="fa-user-circle" className={selectedRole === role ? "text-white" : "text-teal"} />
                  {role}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#e7eaec] rounded">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] text-dark font-bold uppercase border-b border-[#e7eaec]">
                  <tr>
                    <th className="p-3.5">Module / Feature Scope</th>
                    <th className="p-3.5 text-center">View</th>
                    <th className="p-3.5 text-center">Add / Create</th>
                    <th className="p-3.5 text-center">Edit / Update</th>
                    <th className="p-3.5 text-center">Delete</th>
                    <th className="p-3.5 text-center">Export Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7eaec]">
                  {activePermissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted">
                        No permission modules found for role "{selectedRole}".
                      </td>
                    </tr>
                  ) : (
                    activePermissions.map((mod) => (
                      <tr key={mod.id} className="hover:bg-gray-50">
                        <td className="p-3.5">
                          <div className="font-bold text-dark flex items-center gap-2">
                            <Icon name="fa-key" className="text-teal text-[13px]" />
                            {mod.name}
                          </div>
                          <span className="text-[11px] text-muted font-normal">{mod.category} Module</span>
                        </td>

                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={mod.canView}
                            onChange={() => handleTogglePermission(mod.id, "canView")}
                            className="w-4 h-4 accent-teal rounded cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={mod.canAdd}
                            onChange={() => handleTogglePermission(mod.id, "canAdd")}
                            className="w-4 h-4 accent-teal rounded cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={mod.canEdit}
                            onChange={() => handleTogglePermission(mod.id, "canEdit")}
                            className="w-4 h-4 accent-teal rounded cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={mod.canDelete}
                            onChange={() => handleTogglePermission(mod.id, "canDelete")}
                            className="w-4 h-4 accent-teal rounded cursor-pointer"
                          />
                        </td>

                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={mod.canExport}
                            onChange={() => handleTogglePermission(mod.id, "canExport")}
                            className="w-4 h-4 accent-teal rounded cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
