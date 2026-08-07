import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { useTheme } from "../../context/ThemeContext";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLanguage } from "../../context/LanguageContext";

export function ThemeWebsitePage() {
  const { t } = useLanguage();
  const { theme, setTheme, isDark, primaryColor, setPrimaryColor } = useTheme();

  const [websiteConfig, setWebsiteConfig] = useState({
    title: "Inilab International Academy Portal",
    motto: "Empowering Minds, Shaping Tomorrow",
    copyright: "© 2026 Inilab School ERP. All Rights Reserved.",
    maintenanceMode: false,
    facebook: "https://facebook.com/inilabschool",
    twitter: "https://twitter.com/inilabschool",
    instagram: "https://instagram.com/inilabschool",
    youtube: "https://youtube.com/inilabschool",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const brandColors = [
    { name: "Orange (Default)", hex: "#E04E00" },
    { name: "Teal Green", hex: "#149c82" },
    { name: "Sapphire Blue", hex: "#0077CD" },
    { name: "Emerald Green", hex: "#10B981" },
    { name: "Amethyst Purple", hex: "#8B5CF6" },
    { name: "Crimson Red", hex: "#E11D48" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: t("Theme & Website settings saved successfully!"), type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeaderBar
          titleKey="Theme & Website Settings"
          iconName="fa-paint-brush"
          breadcrumbLabel="Theme & Website"
          rightContent={
            <Button
              variant="success"
              onClick={handleSave}
              className="bg-teal text-white font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1.5"
            >
              <Icon name="fa-save" /> <span>{t("Save Settings")}</span>
            </Button>
          }
        />

        {toast && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-2">
            <Icon name="fa-check-circle" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* SECTION 1: THEME SELECTION - ONLY 2 OPTIONS: LIGHT & DARK */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-sm border border-[#e7eaec] dark:border-slate-700 space-y-6">
          <div className="border-b border-[#e7eaec] dark:border-slate-700 pb-3">
            <h4 className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icon name="fa-adjust" className="text-teal" />
              <span>{t("Choose Application Theme (2 Options)")}</span>
            </h4>
            <p className="text-xs text-muted dark:text-slate-400 mt-1">
              Select Light Mode to keep original classic UI or Dark Mode for high-contrast dark theme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* 1. LIGHT MODE OPTION */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-6 rounded-lg border-2 flex flex-col items-center gap-4 transition-all cursor-pointer bg-white text-dark ${
                theme === "light"
                  ? "border-teal ring-2 ring-teal/30 shadow-md"
                  : "border-[#e7eaec] hover:border-teal"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                <Icon name="fa-sun-o" className="text-[24px]" />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-dark">{t("1. Light Mode (Original UI)")}</div>
                <p className="text-xs text-muted mt-1">
                  {t("Original crisp white & classic layout design. Exact UI as before.")}
                </p>
              </div>
              {theme === "light" ? (
                <span className="px-3 py-1 rounded text-xs font-bold bg-teal text-white flex items-center gap-1">
                  <Icon name="fa-check-circle" /> {t("Currently Active")}
                </span>
              ) : (
                <span className="px-3 py-1 rounded text-xs font-semibold bg-gray-100 text-muted">
                  {t("Select Light Theme")}
                </span>
              )}
            </button>

            {/* 2. DARK MODE OPTION */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-6 rounded-lg border-2 flex flex-col items-center gap-4 transition-all cursor-pointer bg-slate-900 text-white ${
                theme === "dark"
                  ? "border-teal ring-2 ring-teal/30 shadow-md"
                  : "border-[#e7eaec] hover:border-teal"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-indigo-950 text-indigo-300 flex items-center justify-center shadow-inner">
                <Icon name="fa-moon-o" className="text-[24px]" />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white">{t("2. Dark Mode (High Contrast)")}</div>
                <p className="text-xs text-slate-300 mt-1">
                  {t("High-contrast dark design. Sharp white text readability with zero hidden text.")}
                </p>
              </div>
              {theme === "dark" ? (
                <span className="px-3 py-1 rounded text-xs font-bold bg-teal text-white flex items-center gap-1">
                  <Icon name="fa-check-circle" /> {t("Currently Active")}
                </span>
              ) : (
                <span className="px-3 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                  {t("Select Dark Theme")}
                </span>
              )}
            </button>
          </div>

          {/* Color Palette Option */}
          <div className="pt-4 border-t border-[#e7eaec] dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold text-muted uppercase tracking-wider">
              {t("Primary Accent Palette:")}
            </label>
            <div className="flex flex-wrap gap-3">
              {brandColors.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setPrimaryColor(col.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all cursor-pointer ${
                    primaryColor === col.hex
                      ? "border-dark ring-2 ring-teal shadow-sm bg-white dark:bg-slate-800"
                      : "border-[#e7eaec] dark:border-slate-700 bg-[#fafafa] dark:bg-slate-900"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: col.hex }} />
                  <span className="text-xs font-semibold text-dark dark:text-white">{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: WEBSITE BRANDING */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-sm border border-[#e7eaec] dark:border-slate-700 space-y-6">
          <div className="border-b border-[#e7eaec] dark:border-slate-700 pb-3">
            <h4 className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Icon name="fa-globe" className="text-teal" />
              <span>{t("Public Website & Portal Branding")}</span>
            </h4>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("Website Title")}
                value={websiteConfig.title}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, title: e.target.value })}
              />

              <Input
                label={t("School Motto / Tagline")}
                value={websiteConfig.motto}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, motto: e.target.value })}
              />

              <div className="md:col-span-2">
                <Input
                  label={t("Footer Copyright Notice")}
                  value={websiteConfig.copyright}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, copyright: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-3">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="fa-share-alt" className="text-teal" />
                <span>{t("Social Media Channels")}</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Facebook URL"
                  value={websiteConfig.facebook}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, facebook: e.target.value })}
                />
                <Input
                  label="Twitter / X URL"
                  value={websiteConfig.twitter}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, twitter: e.target.value })}
                />
                <Input
                  label="Instagram URL"
                  value={websiteConfig.instagram}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, instagram: e.target.value })}
                />
                <Input
                  label="YouTube Channel URL"
                  value={websiteConfig.youtube}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, youtube: e.target.value })}
                />
              </div>
            </div>

            <div className="p-4 bg-[#fafafa] dark:bg-slate-900 rounded border border-[#e7eaec] dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-dark dark:text-white flex items-center gap-2">
                  <Icon name="fa-wrench" className="text-teal" />
                  <span>{t("Portal Maintenance Mode")}</span>
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {t("When active, public portal shows a temporary maintenance notice.")}
                </div>
              </div>
              <input
                type="checkbox"
                checked={websiteConfig.maintenanceMode}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-teal rounded cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
