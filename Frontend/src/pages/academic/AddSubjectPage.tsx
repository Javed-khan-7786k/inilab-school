import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import type { ClassItem, Teacher } from "../../types";

export const AddSubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [code, setCode] = useState("");
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [passMark, setPassMark] = useState("33");
  const [finalMark, setFinalMark] = useState("100");

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [classes, teachers] = await Promise.all([
          dataService.getClasses(),
          dataService.getTeachers(),
        ]);
        setClassesList(classes);
        setTeachersList(teachers);

        if (isEditMode && id) {
          const subjectData = await dataService.getSubjectById(id);
          setName(subjectData.name || "");
          setAuthor(subjectData.author || "");
          setCode(subjectData.code || "");
          setClassName(subjectData.className || "");
          setClassId(subjectData.classId || "");
          setTeacherName(subjectData.teacherName || "");
          setTeacherId(subjectData.teacherId || "");
          setPassMark(String(subjectData.passMark || "33"));
          setFinalMark(String(subjectData.finalMark || "100"));
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load subject data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!className.trim()) errs.className = t("Class selection is required");
    if (!name.trim()) errs.name = t("Subject name is required");
    if (!code.trim()) errs.code = t("Subject code is required");
    if (!teacherName.trim()) errs.teacherName = t("Teacher selection is required");
    if (!passMark.trim()) errs.passMark = t("Pass mark is required");
    if (!finalMark.trim()) errs.finalMark = t("Final mark is required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setClassName(selectedName);
    const selectedClass = classesList.find((c) => c.name === selectedName);
    if (selectedClass) {
      setClassId(String(selectedClass.id));
    } else {
      setClassId("");
    }
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setTeacherName(selectedName);
    const selectedTeacher = teachersList.find((tItem) => tItem.name === selectedName);
    if (selectedTeacher) {
      setTeacherId(String(selectedTeacher.id));
    } else {
      setTeacherId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name,
        author,
        code,
        className,
        classId,
        teacherName,
        teacherId,
        passMark: Number(passMark),
        finalMark: Number(finalMark),
      };

      if (isEditMode && id) {
        await dataService.updateSubject(id, payload);
        showToast(t("Subject updated successfully"), "success");
      } else {
        await dataService.addSubject(payload);
        showToast(t("Subject added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/academic/subject");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save subject"), "error");
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
        titleKey={isEditMode ? "Edit Subject" : "Add Subject"}
        iconName="fa-book"
        breadcrumbLabel={isEditMode ? "Edit Subject" : "Add Subject"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Subject") : t("Add Subject")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Class Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Class")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={className}
                  onChange={handleClassChange}
                  className="w-full"
                >
                  <option value="">{t("Select Class")}</option>
                  {classesList.map((cItem) => (
                    <option key={cItem.id} value={cItem.name}>
                      {cItem.name}
                    </option>
                  ))}
                </Select>
                {errors.className && (
                  <p className="text-red-500 text-xs mt-1">{errors.className}</p>
                )}
              </div>
            </div>

            {/* Subject Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Subject Name")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Subject Author */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Subject Author")}
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. R.D. Sharma"
                  className="w-full"
                />
              </div>
            </div>

            {/* Subject Code */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Subject Code")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. MATH101"
                  className="w-full"
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Teacher Name")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={teacherName}
                  onChange={handleTeacherChange}
                  className="w-full"
                >
                  <option value="">{t("Select Teacher")}</option>
                  {teachersList.map((tItem) => (
                    <option key={tItem.id} value={tItem.name}>
                      {tItem.name} {tItem.designation ? `(${tItem.designation})` : ""}
                    </option>
                  ))}
                </Select>
                {errors.teacherName && (
                  <p className="text-red-500 text-xs mt-1">{errors.teacherName}</p>
                )}
              </div>
            </div>

            {/* Pass Mark */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Pass Mark")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="number"
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  placeholder="e.g. 33"
                  className="w-full"
                />
                {errors.passMark && <p className="text-red-500 text-xs mt-1">{errors.passMark}</p>}
              </div>
            </div>

            {/* Final Mark */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Final Mark")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="number"
                  value={finalMark}
                  onChange={(e) => setFinalMark(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full"
                />
                {errors.finalMark && <p className="text-red-500 text-xs mt-1">{errors.finalMark}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Subject")
                ) : (
                  t("Add Subject")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/academic/subject")}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
            toast.type === "success"
              ? "bg-teal bg-[#1abc9c] shadow-[#1abc9c]/20"
              : "bg-iconred bg-red-500 shadow-red-500/20"
          }`}
        >
          <Icon
            name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}
            className="text-[16px]"
          />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
