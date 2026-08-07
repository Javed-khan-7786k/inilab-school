import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/ui/Icon";
import { useLanguage } from "../../context/LanguageContext";

export function MessageMailPage() {
  const { t } = useLanguage();

  const [smsGateway, setSmsGateway] = useState({
    provider: "MSG91",
    apiKey: "MSG91_SECRET_KEY_778899XX",
    senderId: "INILAB",
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.gmail.com",
    port: "587",
    encryption: "TLS",
    username: "notifications@inilabacademy.edu.in",
    password: "••••••••••••••••",
    fromName: "Inilab Academy Desk",
  });

  const [triggers, setTriggers] = useState({
    studentAbsence: true,
    feeOverdue: true,
    examSchedulePublished: true,
    reportCardGenerated: true,
  });

  const [showTestModal, setShowTestModal] = useState<"sms" | "email" | null>(null);
  const [testTarget, setTestTarget] = useState("");
  const [testLog, setTestLog] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: t("Message and Email settings saved!"), type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRunTest = () => {
    if (!testTarget) return;
    setTestLog("Processing gateway request...");
    setTimeout(() => {
      setTestLog(`[SUCCESS] Test ${showTestModal?.toUpperCase()} delivered to ${testTarget}! (HTTP 200 OK)`);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PageHeaderBar
          titleKey="Message & Mail Settings"
          iconName="fa-envelope"
          breadcrumbLabel="Message & Mail"
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

        {/* Modal */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded p-6 border border-[#e7eaec] max-w-md w-full space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#e7eaec] pb-3">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                  <Icon name="fa-paper-plane" className="text-teal" />
                  Test {showTestModal === "sms" ? "SMS Gateway" : "Email Server"}
                </h3>
                <button
                  onClick={() => {
                    setShowTestModal(null);
                    setTestLog(null);
                  }}
                  className="text-muted text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <Input
                label={showTestModal === "sms" ? "Phone Number" : "Email Address"}
                placeholder={showTestModal === "sms" ? "+919876543210" : "test@example.com"}
                value={testTarget}
                onChange={(e) => setTestTarget(e.target.value)}
                requiredField
              />

              {testLog && (
                <div className="p-3 bg-[#fafafa] font-mono text-[11px] rounded border border-[#e7eaec] text-teal">
                  {testLog}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowTestModal(null);
                    setTestLog(null);
                  }}
                >
                  Close
                </Button>
                <Button variant="success" size="sm" onClick={handleRunTest}>
                  Send Test
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMS */}
          <div className="bg-white p-6 rounded shadow-sm border border-[#e7eaec] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7eaec] pb-3">
              <h4 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                <Icon name="fa-mobile" className="text-teal" />
                <span>{t("SMS Gateway API")}</span>
              </h4>
              <Button variant="outline" size="sm" onClick={() => setShowTestModal("sms")}>
                Test SMS
              </Button>
            </div>

            <Select
              label={t("SMS Provider")}
              value={smsGateway.provider}
              onChange={(e) => setSmsGateway({ ...smsGateway, provider: e.target.value })}
              options={[
                { value: "MSG91", label: "MSG91 Gateway" },
                { value: "Twilio", label: "Twilio Global" },
                { value: "Fast2SMS", label: "Fast2SMS Gateway" },
              ]}
            />

            <Input
              label={t("API Key / Secret")}
              type="password"
              value={smsGateway.apiKey}
              onChange={(e) => setSmsGateway({ ...smsGateway, apiKey: e.target.value })}
            />

            <Input
              label={t("Sender ID")}
              value={smsGateway.senderId}
              onChange={(e) => setSmsGateway({ ...smsGateway, senderId: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div className="bg-white p-6 rounded shadow-sm border border-[#e7eaec] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7eaec] pb-3">
              <h4 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                <Icon name="fa-envelope" className="text-teal" />
                <span>{t("SMTP Email Server")}</span>
              </h4>
              <Button variant="outline" size="sm" onClick={() => setShowTestModal("email")}>
                Test Email
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("SMTP Host")}
                value={smtpConfig.host}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
              />

              <Input
                label={t("Port Number")}
                value={smtpConfig.port}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
              />

              <Select
                label={t("Encryption")}
                value={smtpConfig.encryption}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })}
                options={[
                  { value: "TLS", label: "TLS (587)" },
                  { value: "SSL", label: "SSL (465)" },
                ]}
              />

              <Input
                label={t("Sender Name")}
                value={smtpConfig.fromName}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
              />
            </div>

            <Input
              label={t("SMTP Username")}
              value={smtpConfig.username}
              onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
            />
          </div>
        </div>

        {/* Triggers */}
        <div className="bg-white p-6 rounded shadow-sm border border-[#e7eaec] space-y-4">
          <h4 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2 border-b border-[#e7eaec] pb-3">
            <Icon name="fa-bell" className="text-teal" />
            <span>{t("Automated Notification Event Triggers")}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 bg-[#fafafa] rounded border border-[#e7eaec] cursor-pointer">
              <span className="text-xs font-bold text-dark">
                Student Absence Alert (Instant SMS to Parents)
              </span>
              <input
                type="checkbox"
                checked={triggers.studentAbsence}
                onChange={(e) => setTriggers({ ...triggers, studentAbsence: e.target.checked })}
                className="w-4 h-4 accent-teal rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#fafafa] rounded border border-[#e7eaec] cursor-pointer">
              <span className="text-xs font-bold text-dark">
                Fee Overdue / Reminder Notifications
              </span>
              <input
                type="checkbox"
                checked={triggers.feeOverdue}
                onChange={(e) => setTriggers({ ...triggers, feeOverdue: e.target.checked })}
                className="w-4 h-4 accent-teal rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
