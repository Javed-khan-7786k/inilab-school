import apiClient from "./apiClient";

export interface PermissionModule {
  id: string;
  name: string;
  category: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface RolePermissionItem {
  _id?: string;
  roleName: string;
  permissions: PermissionModule[];
}

export const rolePermissionApi = {
  async getAll(): Promise<RolePermissionItem[]> {
    const response = await apiClient.get("/role-permissions");
    return response.data?.data;
  },

  async updateRolePermission(roleName: string, permissions: PermissionModule[]): Promise<RolePermissionItem> {
    const response = await apiClient.put(`/role-permissions/${encodeURIComponent(roleName)}`, { permissions });
    return response.data?.data;
  },

  async createRole(roleName: string): Promise<RolePermissionItem> {
    const response = await apiClient.post("/role-permissions", { roleName });
    return response.data?.data;
  },
};
