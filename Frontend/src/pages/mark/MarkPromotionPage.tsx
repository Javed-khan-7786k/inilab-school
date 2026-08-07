import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { NoteBanner } from "../../components/common/NoteBanner";
import { Toast } from "../../components/ui/Toast";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import { useLanguage } from "../../context/LanguageContext";
import type { ClassItem } from "../../types";

export function MarkPromotionPage() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [classesList, setClassesList] = useState<ClassItem[]>([]);

  // Selection states
  const [academicYear, setAcademicYear] = useState("2025-2026 (Default)");
  const [className, setClassName] = useState("One");
  const [promotionAcademicYear, setPromotionAcademicYear] = useState("2026-2027");
  const [promotionClassName, setPromotionClassName] = useState("Two");
  const [promotionType, setPromotionType] = useState<"Normal" | "Advance">("Normal");

  // Advance Mode States
  const [selectedExams, setSelectedExams] = useState<string[]>([
    "First Semester",
    "Second Semester",
    "Third Semester",
  ]);

  const [subjectPassMarks, setSubjectPassMarks] = useState<Record<string, number | string>>({
    English: 33,
    Bangla: 33,
    Drawing: 33,
    "Math Matrix": 33,
    Science: 25,
    Math: 33,
    ICT: 33,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [classes, setting] = await Promise.all([
          dataService.getClasses(),
          dataService.getPromotionSetting({ academicYear: "2025-2026", className: "One" }),
        ]);

        setClassesList(classes);
        if (setting) {
          setAcademicYear(setting.academicYear || "2025-2026 (Default)");
          setClassName(setting.className || "One");
          setPromotionAcademicYear(setting.promotionAcademicYear || "2026-2027");
          setPromotionClassName(setting.promotionClassName || "Two");
          setPromotionType(setting.promotionType || "Normal");
          if (setting.selectedExams) setSelectedExams(setting.selectedExams);
          if (setting.subjectPassMarks) setSubjectPassMarks(setting.subjectPassMarks);
        }
      } catch (err: any) {
        console.error("Failed to load promotion data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleExamToggle = (exam: string) => {
    setSelectedExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );
  };

  const handlePassMarkChange = (subject: string, value: string) => {
    setSubjectPassMarks((prev) => ({
      ...prev,
      [subject]: value === "" ? "" : Number(value),
    }));
  };

  const handleSaveSetting = async () => {
    setSubmitting(true);
    try {
      await dataService.savePromotionSetting({
        academicYear,
        className,
        promotionAcademicYear,
        promotionClassName,
        promotionType,
        selectedExams,
        subjectPassMarks,
      });

      showToast(t("Promotion setting saved successfully"), "success");
    } catch (err: any) {
      showToast(err.message || t("Failed to save promotion setting"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={"Promotion"}
        iconName="fa-level-up"
        breadcrumbLabel={"Promotion"}
      />

      <div className="p-[20px] bg-bodyBg space-y-6">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Promotion")}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Note Banner */}
            <NoteBanner note={t("Note: Select Academic year & class")} />

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Academic Year */}
              <div>
                <label className="block text-[13px] font-semibold text-[#444] mb-1">
                  {t("Academic Year")} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full"
                >
                  <option value="2025-2026 (Default)">2025-2026 (Default)</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                </Select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-[13px] font-semibold text-[#444] mb-1">
                  {t("Class")} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full"
                >
                  <option value="">{t("Select Class")}</option>
                  {classesList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Conditional Promotion Fields (Generated when Academic Year & Class selected) */}
            {academicYear && className && (
              <div className="space-y-6 pt-4 border-t border-[#eee] animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Promotion Academic Year */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#444] mb-1">
                      {t("Promotion Academic Year")} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={promotionAcademicYear}
                      onChange={(e) => setPromotionAcademicYear(e.target.value)}
                      className="w-full"
                    >
                      <option value="2026-2027">2026-2027</option>
                      <option value="2025-2026">2025-2026</option>
                    </Select>
                  </div>

                  {/* Promotion Class */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#444] mb-1">
                      {t("Promotion Class")} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={promotionClassName}
                      onChange={(e) => setPromotionClassName(e.target.value)}
                      className="w-full"
                    >
                      <option value="">{t("Select Promotion Class")}</option>
                      {classesList.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Promotion Type Toggle (Normal / Advance) */}
                <div className="pt-2">
                  <label className="block text-[13px] font-semibold text-[#444] mb-2">
                    {t("Promotion Type")}
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#333]">
                      <input
                        type="radio"
                        name="promotionType"
                        value="Normal"
                        checked={promotionType === "Normal"}
                        onChange={() => setPromotionType("Normal")}
                        className="accent-primary cursor-pointer"
                      />
                      {t("Normal (by default)")}
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#333]">
                      <input
                        type="radio"
                        name="promotionType"
                        value="Advance"
                        checked={promotionType === "Advance"}
                        onChange={() => setPromotionType("Advance")}
                        className="accent-primary cursor-pointer"
                      />
                      {t("Advance")}
                    </label>
                  </div>
                </div>

                {/* Advance Mode Configuration (Exams & Subject Pass Marks) */}
                {promotionType === "Advance" && (
                  <div className="p-5 bg-[#fafafa] rounded-[3px] border border-[#e5e5e5] space-y-6 animate-fadeIn">
                    {/* Exam Checkboxes */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#444] mb-2">
                        {t("Exam")}
                      </label>
                      <div className="flex flex-wrap items-center gap-6">
                        {["First Semester", "Second Semester", "Third Semester"].map((exam) => (
                          <label
                            key={exam}
                            className="inline-flex items-center gap-2 cursor-pointer text-[13px] text-[#444]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedExams.includes(exam)}
                              onChange={() => handleExamToggle(exam)}
                              className="accent-primary cursor-pointer"
                            />
                            {exam}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Subject Pass Marks */}
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#333] mb-3">
                        {t("Subject Pass Marks")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(subjectPassMarks).map(([subject, mark]) => (
                          <div key={subject}>
                            <label className="block text-[12px] font-semibold text-[#555] mb-1">
                              {subject} {t("Pass Mark")}
                            </label>
                            <Input
                              type="number"
                              value={mark}
                              onChange={(e) => handlePassMarkChange(subject, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-[#eee] flex items-center justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSaveSetting}
                    disabled={submitting}
                  >
                    {submitting ? <Spinner size="sm" /> : t("Promotion mark setting")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
