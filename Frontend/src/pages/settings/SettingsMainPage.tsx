import React, { useState } from "react";
import { SchoolSettingsPage } from "./SchoolSettingsPage";
import { UsersPermissionPage } from "./UsersPermissionPage";
import { MessageMailPage } from "./MessageMailPage";
import { ProductLicensePage } from "./ProductLicensePage";
import { Icon } from "../../components/ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../services/authService";

export type SettingsModuleTab =
  | "school"
  | "users-permission"
  | "message-mail"
  | "product-license";

export function SettingsMainPage({ defaultModule = "school" }: { defaultModule?: SettingsModuleTab }) {
  const { t } = useLanguage();
  const [activeModule, setActiveModule] = useState<SettingsModuleTab>(defaultModule);

  const userRole = (authService.getUserRole() || "admin").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "administrator" || userRole === "superadmin";

  if (!isAdmin) {
    return (
      <div className="p-8 bg-white border border-[#e1e1e1] rounded text-center space-y-4 max-w-2xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center border border-red-200">
          <Icon name="fa-shield" className="text-[28px]" />
        </div>
        <h2 className="text-lg font-bold text-[#333]">{t("Access Restricted — Admin Role Required")}</h2>
        <p className="text-sm text-[#666]">
          {t("System & School Settings can only be accessed and modified by Authorized Administrators.")}
        </p>
        <div>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
            Role: {userRole.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Master Settings Sub-Tab Navigation Bar */}
      <div className="bg-white px-6 pt-4 pb-0 rounded-t shadow-sm border-b border-[#e7eaec] flex items-center gap-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveModule("school")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
            activeModule === "school"
              ? "border-teal text-teal font-bold"
              : "border-transparent text-muted hover:text-dark"
          }`}
        >
          <Icon name="fa-university" />
          <span>{t("School Settings")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModule("users-permission")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
            activeModule === "users-permission"
              ? "border-teal text-teal font-bold"
              : "border-transparent text-muted hover:text-dark"
          }`}
        >
          <Icon name="fa-users" />
          <span>{t("Users and Permission")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModule("message-mail")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
            activeModule === "message-mail"
              ? "border-teal text-teal font-bold"
              : "border-transparent text-muted hover:text-dark"
          }`}
        >
          <Icon name="fa-envelope" />
          <span>{t("Message and Mail")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModule("product-license")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
            activeModule === "product-license"
              ? "border-teal text-teal font-bold"
              : "border-transparent text-muted hover:text-dark"
          }`}
        >
          <Icon name="fa-certificate" />
          <span>{t("Product Licence")}</span>
        </button>
      </div>

      {/* Render Selected Module */}
      {activeModule === "school" && <SchoolSettingsPage />}
      {activeModule === "users-permission" && <UsersPermissionPage />}
      {activeModule === "message-mail" && <MessageMailPage />}
      {activeModule === "product-license" && <ProductLicensePage />}
    </div>
  );
}
