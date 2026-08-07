import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { FormRow } from "../../components/common/FormRow";
import { Toast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";

export const AddMarkDistributionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form fields
  const [markDistributionType, setMarkDistributionType] = useState("");
  const [markValue, setMarkValue] = useState<number | string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && id) {
        try {
          const item = await dataService.getMarkDistributionById(id);
          setMarkDistributionType(item.markDistributionType || "");
          setMarkValue(item.markValue ?? "");
        } catch (err: any) {
          showToast(err.message || t("Failed to load mark distribution data"), "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!markDistributionType.trim()) {
      errs.markDistributionType = t("Mark distribution type is required");
    }
    if (markValue === "" || markValue === null || markValue === undefined) {
      errs.markValue = t("Mark value is required");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        markDistributionType,
        markValue: Number(markValue),
      };

      if (isEditMode && id) {
        await dataService.updateMarkDistribution(id, payload);
        showToast(t("Mark distribution updated successfully"), "success");
      } else {
        await dataService.addMarkDistribution(payload);
        showToast(t("Mark distribution added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/mark/distribution");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save mark distribution"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-bodyBg flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={isEditMode ? "Edit Mark Distribution" : "Add Mark Distribution"}
        iconName="fa-sliders"
        breadcrumbLabel={isEditMode ? "Edit Mark Distribution" : "Add Mark Distribution"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Mark Distribution") : t("Add Mark Distribution")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormRow
              label={t("Mark Distribution Type")}
              required
              error={errors.markDistributionType}
            >
              <Input
                type="text"
                value={markDistributionType}
                onChange={(e) => setMarkDistributionType(e.target.value)}
                placeholder="e.g. Exam, Attendance, Class Test"
                className="w-full"
              />
            </FormRow>

            <FormRow label={t("Mark Value")} required error={errors.markValue}>
              <Input
                type="number"
                value={markValue}
                onChange={(e) => setMarkValue(e.target.value)}
                placeholder="e.g. 70, 10, 100"
                className="w-full"
              />
            </FormRow>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Mark Distribution")
                ) : (
                  t("Add Mark Distribution")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/mark/distribution")}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
};
