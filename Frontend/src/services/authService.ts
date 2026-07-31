import { authApi } from "./api/authApi";

export const authService = {
  async login(username: string, password: string): Promise<unknown> {
    try {
      const data = await authApi.login(username.trim(), password);
      if (data && data.token) {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userRole", data.user.role);
        sessionStorage.setItem("userName", data.user.name);
        sessionStorage.setItem("loginUsername", data.user.username);
        sessionStorage.setItem("userPhoto", data.user.photo || "");
        sessionStorage.setItem("token", data.token);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  },

  logout(): void {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("loginUsername");
    sessionStorage.removeItem("userPhoto");
    sessionStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return sessionStorage.getItem("isAuthenticated") === "true";
  },

  getUserRole(): string {
    return sessionStorage.getItem("userRole") || "";
  },

  getUserName(): string {
    return sessionStorage.getItem("userName") || "";
  },

  getLoginUsername(): string {
    return sessionStorage.getItem("loginUsername") || "";
  },

  getUserPhoto(): string {
    return sessionStorage.getItem("userPhoto") || "";
  }
};
