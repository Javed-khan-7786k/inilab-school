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

export const AddGradePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [gradeName, setGradeName] = useState("");
  const [gradePoint, setGradePoint] = useState("");
  const [markFrom, setMarkFrom] = useState<number | string>("");
  const [markUpto, setMarkUpto] = useState<number | string>("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && id) {
        try {
          const gradeData = await dataService.getGradeById(id);
          setGradeName(gradeData.gradeName || "");
          setGradePoint(gradeData.gradePoint || "");
          setMarkFrom(gradeData.markFrom ?? "");
          setMarkUpto(gradeData.markUpto ?? "");
          setNote(gradeData.note || "");
        } catch (err: any) {
          showToast(err.message || t("Failed to load grade data"), "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!gradeName.trim()) errs.gradeName = t("Grade name is required");
    if (!gradePoint.trim()) errs.gradePoint = t("Grade point is required");
    if (markFrom === "" || markFrom === null || markFrom === undefined) errs.markFrom = t("Mark from is required");
    if (markUpto === "" || markUpto === null || markUpto === undefined) errs.markUpto = t("Mark upto is required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        gradeName,
        gradePoint,
        markFrom: Number(markFrom),
        markUpto: Number(markUpto),
        note,
      };

      if (isEditMode && id) {
        await dataService.updateGrade(id, payload);
        showToast(t("Grade updated successfully"), "success");
      } else {
        await dataService.addGrade(payload);
        showToast(t("Grade added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/exam/grade");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save grade"), "error");
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
        titleKey={isEditMode ? "Edit Grade" : "Add Grade"}
        iconName="fa-graduation-cap"
        breadcrumbLabel={isEditMode ? "Edit Grade" : "Add Grade"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Grade") : t("Add Grade")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormRow label={t("Grade Name")} required error={errors.gradeName}>
              <Input
                type="text"
                value={gradeName}
                onChange={(e) => setGradeName(e.target.value)}
                placeholder="e.g. A+"
                className="w-full"
              />
            </FormRow>

            <FormRow label={t("Grade Point")} required error={errors.gradePoint}>
              <Input
                type="text"
                value={gradePoint}
                onChange={(e) => setGradePoint(e.target.value)}
                placeholder="e.g. 5.00"
                className="w-full"
              />
            </FormRow>

            <FormRow label={t("Mark From")} required error={errors.markFrom}>
              <Input
                type="number"
                value={markFrom}
                onChange={(e) => setMarkFrom(e.target.value)}
                placeholder="e.g. 80"
                className="w-full"
              />
            </FormRow>

            <FormRow label={t("Mark Upto")} required error={errors.markUpto}>
              <Input
                type="number"
                value={markUpto}
                onChange={(e) => setMarkUpto(e.target.value)}
                placeholder="e.g. 100"
                className="w-full"
              />
            </FormRow>

            <FormRow label={t("Note")} alignTop>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Excellent"
                className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
              />
            </FormRow>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Grade")
                ) : (
                  t("Add Grade")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/exam/grade")}
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
