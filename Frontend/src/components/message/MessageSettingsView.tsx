import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { messageSettingApi, type MessageSettingData } from "../../services/api/messageSettingApi";

export const MessageSettingsView: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testPhone, setTestPhone] = useState("+919876543210");
  const [activeTab, setActiveTab] = useState<"types" | "api" | "triggers" | "templates">("types");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [settings, setSettings] = useState<MessageSettingData>({
    enabledMessageTypes: {
      notice: true,
      attendance: true,
      feeReminder: true,
      examUpdate: true,
      eventAlert: true,
      custom: true,
    },
    apiConfig: {
      provider: "Twilio",
      apiKey: "",
      apiSecret: "",
      senderId: "SCHOOL_SMS",
      apiEndpoint: "https://api.sms-provider.com/v1/send",
      isActive: true,
    },
    autoSendTriggers: {
      autoSendOnAbsent: true,
      autoSendOnNotice: false,
      autoSendFeeDueDate: false,
    },
    templates: {
      attendanceAbsent: "Dear Parent, your child {student_name} of class {class_name} was marked ABSENT today ({date}).",
      noticeAlert: "School Notice: {notice_title}. Please check student portal for details.",
      feeReminder: "Dear Parent, a fee installment for {student_name} is due on {due_date}. Amount: {amount}.",
    },
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await messageSettingApi.getSettings();
        if (data) setSettings(data);
      } catch (err: any) {
        showToast(err.message || "Failed to load message settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await messageSettingApi.updateSettings(settings);
      setSettings(updated);
      showToast("Message settings & API credentials updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMS = async () => {
    setTesting(true);
    try {
      const result = await messageSettingApi.sendTestSMS(
        testPhone,
        `Test Alert from School Management System (${settings.apiConfig.provider || "Gateway"}). API active!`
      );
      if (result.success) {
        showToast(`✅ ${result.message || "Test SMS processed successfully!"}`, "success");
      } else {
        showToast(`⚠️ Test message error: ${result.message || "Check API configuration"}`, "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to send test message", "error");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e7eaec] pb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-dark flex items-center gap-2">
            <Icon name="fa-cogs" className="text-teal" />
            <span>{t("Message Settings & API Sender Setup")}</span>
          </h3>
          <p className="text-xs text-muted mt-1">
            Configure message types, message gateway API keys, automated trigger rules, and message body templates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleTestSMS}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded shadow-sm text-sm border-0 flex items-center gap-2"
          >
            {testing ? <Spinner size="sm" /> : <><Icon name="fa-paper-plane" /> <span>{t("Test Sender API")}</span></>}
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={saving}
            className="bg-teal hover:opacity-90 text-white font-bold px-5 py-2 rounded shadow-sm text-sm border-0 flex items-center gap-2"
          >
            {saving ? <Spinner size="sm" /> : <><Icon name="fa-save" /> <span>{t("Save Settings")}</span></>}
          </Button>
        </div>
      </div>

      {/* Settings Sub-Tabs */}
      <div className="flex border-b border-[#e7eaec] space-x-4">
        {[
          { id: "types", label: "Message Types", icon: "fa-list" },
          { id: "api", label: "Message Sender API", icon: "fa-key" },
          { id: "triggers", label: "Auto Triggers", icon: "fa-flash" },
          { id: "templates", label: "Templates", icon: "fa-file-text-o" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
              activeTab === tab.id
                ? "border-teal text-teal font-bold"
                : "border-transparent text-muted hover:text-dark"
            }`}
          >
            <Icon name={tab.icon} />
            <span>{t(tab.label)}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Message Types */}
      {activeTab === "types" && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Select Active Message Types</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "notice", title: "Notice Messages", desc: "Send official school notices & urgent circulars to parents/students." },
              { key: "attendance", title: "Attendance Alerts", desc: "Send daily student present/absent status updates." },
              { key: "feeReminder", title: "Fee Reminders", desc: "Send automated alerts for due fee installments and payment receipts." },
              { key: "examUpdate", title: "Exam & Result Alerts", desc: "Notify about exam schedules, admit cards, and report cards." },
              { key: "eventAlert", title: "Event & Holiday Alerts", desc: "Broadcasting upcoming school events and holiday announcements." },
              { key: "custom", title: "Custom SMS Broadcast", desc: "Allow custom manual single or bulk SMS broadcasts." },
            ].map((item) => (
              <div key={item.key} className="p-4 border border-[#e7eaec] rounded-lg bg-[#fafafa] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-dark">{t(item.title)}</h4>
                  <p className="text-xs text-muted mt-0.5">{t(item.desc)}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!(settings.enabledMessageTypes as any)[item.key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enabledMessageTypes: {
                          ...settings.enabledMessageTypes,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Message Sender API Configuration */}
      {activeTab === "api" && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3.5 rounded text-xs text-blue-800">
            <div className="flex items-center gap-2">
              <Icon name="fa-info-circle" className="text-base text-blue-600" />
              <span>Configure your Gateway API credentials (Twilio, MSG91, Fast2SMS, or custom gateway) to enable real-time delivery.</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-dark mb-1">{t("Gateway Provider")}</label>
              <select
                value={settings.apiConfig.provider}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    apiConfig: { ...settings.apiConfig, provider: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded text-sm focus:ring-1 focus:ring-teal focus:outline-none"
              >
                <option value="Twilio">Twilio SMS / WhatsApp API</option>
                <option value="MSG91">MSG91 Gateway</option>
                <option value="Fast2SMS">Fast2SMS Gateway</option>
                <option value="Custom">Custom HTTP Gateway Endpoint</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dark mb-1">{t("API Key / Token")}</label>
                <input
                  type="password"
                  value={settings.apiConfig.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apiConfig: { ...settings.apiConfig, apiKey: e.target.value },
                    })
                  }
                  placeholder="Enter API Key"
                  className="w-full px-3 py-2 border border-[#cbd5e1] rounded text-sm focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark mb-1">{t("Sender ID / Header")}</label>
                <input
                  type="text"
                  value={settings.apiConfig.senderId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apiConfig: { ...settings.apiConfig, senderId: e.target.value },
                    })
                  }
                  placeholder="e.g. SCHLMS"
                  className="w-full px-3 py-2 border border-[#cbd5e1] rounded text-sm focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-1">{t("API Endpoint URL")}</label>
              <input
                type="text"
                value={settings.apiConfig.apiEndpoint}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    apiConfig: { ...settings.apiConfig, apiEndpoint: e.target.value },
                  })
                }
                placeholder="https://api.gateway.com/send"
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded text-sm focus:ring-1 focus:ring-teal focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="apiActive"
                checked={settings.apiConfig.isActive}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    apiConfig: { ...settings.apiConfig, isActive: e.target.checked },
                  })
                }
                className="w-4 h-4 text-teal rounded border-gray-300 focus:ring-teal"
              />
              <label htmlFor="apiActive" className="text-xs font-bold text-dark cursor-pointer">
                {t("Enable Live API Sender Service")}
              </label>
            </div>

            {/* Test Phone Number Field */}
            <div className="pt-3 border-t border-[#e7eaec]">
              <label className="block text-xs font-bold text-dark mb-1">{t("Test Recipient Mobile Number")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="flex-1 px-3 py-2 border border-[#cbd5e1] rounded text-xs focus:ring-1 focus:ring-teal focus:outline-none"
                />
                <Button
                  variant="secondary"
                  onClick={handleTestSMS}
                  disabled={testing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs border-0"
                >
                  {testing ? <Spinner size="sm" /> : t("Send Test SMS")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Auto Triggers */}
      {activeTab === "triggers" && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Automated Message Triggers</p>
          
          <div className="p-4 border border-[#e7eaec] rounded-lg bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-dark">{t("Auto-SMS on Student Absence")}</h4>
                <p className="text-xs text-muted">Automatically send SMS to parent when student is marked Absent during attendance submission.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSendTriggers.autoSendOnAbsent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoSendTriggers: { ...settings.autoSendTriggers, autoSendOnAbsent: e.target.checked },
                  })
                }
                className="w-5 h-5 text-teal rounded border-gray-300 focus:ring-teal"
              />
            </div>

            <hr className="border-[#f0f0f0]" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-dark">{t("Auto-SMS on New Notice")}</h4>
                <p className="text-xs text-muted">Broadcast SMS alert when a new school notice is published.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSendTriggers.autoSendOnNotice}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoSendTriggers: { ...settings.autoSendTriggers, autoSendOnNotice: e.target.checked },
                  })
                }
                className="w-5 h-5 text-teal rounded border-gray-300 focus:ring-teal"
              />
            </div>

            <hr className="border-[#f0f0f0]" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-dark">{t("Auto Fee Due Date Reminder")}</h4>
                <p className="text-xs text-muted">Send automated reminder SMS 3 days prior to fee due date.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSendTriggers.autoSendFeeDueDate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoSendTriggers: { ...settings.autoSendTriggers, autoSendFeeDueDate: e.target.checked },
                  })
                }
                className="w-5 h-5 text-teal rounded border-gray-300 focus:ring-teal"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Templates */}
      {activeTab === "templates" && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Message Templates</p>

          <div>
            <label className="block text-xs font-bold text-dark mb-1">{t("Attendance Absence Template")}</label>
            <textarea
              rows={3}
              value={settings.templates.attendanceAbsent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  templates: { ...settings.templates, attendanceAbsent: e.target.value },
                })
              }
              className="w-full p-2.5 border border-[#cbd5e1] rounded text-xs focus:ring-1 focus:ring-teal focus:outline-none"
            />
            <p className="text-[11px] text-muted mt-0.5">Placeholders: &#123;student_name&#125;, &#123;class_name&#125;, &#123;date&#125;</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark mb-1">{t("Notice Broadcast Template")}</label>
            <textarea
              rows={3}
              value={settings.templates.noticeAlert}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  templates: { ...settings.templates, noticeAlert: e.target.value },
                })
              }
              className="w-full p-2.5 border border-[#cbd5e1] rounded text-xs focus:ring-1 focus:ring-teal focus:outline-none"
            />
            <p className="text-[11px] text-muted mt-0.5">Placeholders: &#123;notice_title&#125;, &#123;date&#125;</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark mb-1">{t("Fee Reminder Template")}</label>
            <textarea
              rows={3}
              value={settings.templates.feeReminder}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  templates: { ...settings.templates, feeReminder: e.target.value },
                })
              }
              className="w-full p-2.5 border border-[#cbd5e1] rounded text-xs focus:ring-1 focus:ring-teal focus:outline-none"
            />
            <p className="text-[11px] text-muted mt-0.5">Placeholders: &#123;student_name&#125;, &#123;due_date&#125;, &#123;amount&#125;</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 ${toast.type === "success" ? "bg-[#1abc9c]" : "bg-red-500"}`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
