import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Icon } from "../../components/ui/Icon";
import { useLanguage } from "../../context/LanguageContext";

export function ProductLicensePage() {
  const { t } = useLanguage();
  const [licenseData, setLicenseData] = useState({
    licenseKey: "INILAB-SCHOOL-PRO-2026-9988-7766-5544",
    planName: "Enterprise Multi-School ERP License",
    status: "Active & Verified",
    licensedTo: "Inilab International Educational Trust",
    domain: "inilabacademy.edu.in",
    issuedDate: "2025-01-01",
    expiryDate: "2027-12-31",
    remainingDays: 512,
  });

  const [showKey, setShowKey] = useState(false);
  const [showActivateForm, setShowActivateForm] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleActivateNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput) return;
    setLicenseData((prev) => ({
      ...prev,
      licenseKey: newKeyInput,
      status: "Active & Verified",
    }));
    setNewKeyInput("");
    setShowActivateForm(false);
    setToast({ message: t("Product License key updated successfully!"), type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeaderBar
          titleKey="Product License"
          iconName="fa-certificate"
          breadcrumbLabel="Product License"
          rightContent={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowActivateForm(!showActivateForm)}
              className="bg-teal text-white"
            >
              <Icon name="fa-key" className="mr-1" />
              <span>{showActivateForm ? t("Cancel") : t("Update License Key")}</span>
            </Button>
          }
        />

        {toast && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-2">
            <Icon name="fa-check-circle" />
            <span>{toast.message}</span>
          </div>
        )}

        {showActivateForm && (
          <form
            onSubmit={handleActivateNewKey}
            className="animate-field-expand bg-[#fafafa] p-4 rounded border border-[#e7eaec] space-y-4"
          >
            <div className="text-xs font-bold text-teal uppercase tracking-wider">
              {t("Enter New Product Serial Key")}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  requiredField
                />
              </div>
              <Button type="submit" variant="success" size="sm" className="mt-5">
                {t("Activate Key")}
              </Button>
            </div>
          </form>
        )}

        <div className="bg-white p-6 rounded shadow-sm border border-[#e7eaec] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e7eaec] pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-teal text-white font-bold text-xs rounded mb-2 inline-block">
                {licenseData.status}
              </span>
              <h3 className="text-base font-bold text-dark">{licenseData.planName}</h3>
              <p className="text-xs text-muted">Licensed to: {licenseData.licensedTo}</p>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-teal">
                {licenseData.remainingDays} Days Left
              </div>
              <div className="text-xs text-muted">Valid till {licenseData.expiryDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#fafafa] rounded border border-[#e7eaec] space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-muted">
                <span>License Key</span>
                <button onClick={() => setShowKey(!showKey)} className="text-muted hover:text-dark">
                  <Icon name={showKey ? "fa-eye-slash" : "fa-eye"} />
                </button>
              </div>
              <div className="font-mono font-bold text-xs text-dark truncate">
                {showKey ? licenseData.licenseKey : "••••-••••-••••-7766-5544"}
              </div>
            </div>

            <div className="p-4 bg-[#fafafa] rounded border border-[#e7eaec] space-y-1">
              <div className="text-xs font-bold text-muted">Registered Domain</div>
              <div className="font-bold text-xs text-dark">{licenseData.domain}</div>
            </div>

            <div className="p-4 bg-[#fafafa] rounded border border-[#e7eaec] space-y-1">
              <div className="text-xs font-bold text-muted">Issued Date</div>
              <div className="font-bold text-xs text-dark">{licenseData.issuedDate}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
