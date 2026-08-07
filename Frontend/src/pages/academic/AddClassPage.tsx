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
import type { Teacher } from "../../types";

export const AddClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [classNumeric, setClassNumeric] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [note, setNote] = useState("");

  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const teachers = await dataService.getTeachers();
        setTeachersList(teachers);

        if (isEditMode && id) {
          const classData = await dataService.getClassById(id);
          setName(classData.name || "");
          setClassNumeric(String(classData.classNumeric || ""));
          setTeacherName(classData.teacherName || "");
          setTeacherId(classData.teacherId || "");
          setNote(classData.note || "");
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load class data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t("Class name is required");
    if (!classNumeric.trim()) errs.classNumeric = t("Class numeric is required");
    if (!teacherName.trim()) errs.teacherName = t("Teacher selection is required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setTeacherName(selectedName);
    const selectedTeacher = teachersList.find((t) => t.name === selectedName);
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
        classNumeric: isNaN(Number(classNumeric)) ? classNumeric : Number(classNumeric),
        teacherName,
        teacherId,
        note,
      };

      if (isEditMode && id) {
        await dataService.updateClass(id, payload);
        showToast(t("Class updated successfully"), "success");
      } else {
        await dataService.addClass(payload);
        showToast(t("Class added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/academic/class");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save class"), "error");
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
        titleKey={isEditMode ? "Edit Class" : "Add Class"}
        iconName="fa-building"
        breadcrumbLabel={isEditMode ? "Edit Class" : "Add Class"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Class") : t("Add Class")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Class Field */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Class")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. One"
                  className="w-full"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Class Numeric Field */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Class Numeric")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={classNumeric}
                  onChange={(e) => {
                    const val = e.target.value;
                    setClassNumeric(val);
                    const classNames: Record<string, string> = {
                      "1": "One",
                      "2": "Two",
                      "3": "Three",
                      "4": "Four",
                      "5": "Five",
                      "6": "Six",
                      "7": "Seven",
                      "8": "Eight",
                      "9": "Nine",
                      "10": "Ten",
                      "11": "Eleven",
                      "12": "Twelve",
                    };
                    if (val && classNames[val]) {
                      if (!name || Object.values(classNames).includes(name)) {
                        setName(classNames[val]);
                      }
                      if (!note || note.startsWith("Class ")) {
                        setNote(`Class ${classNames[val].toLowerCase()} (1-12)`);
                      }
                    }
                  }}
                  className="w-full"
                >
                  <option value="">{t("Select Class Numeric (1-12)")}</option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
                {errors.classNumeric && (
                  <p className="text-red-500 text-xs mt-1">{errors.classNumeric}</p>
                )}
              </div>
            </div>

            {/* Teacher Name Field */}
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

            {/* Note Field */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t("Note")}
              </label>
              <div className="sm:w-3/4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Class one (1-12)"
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end sm:pl-[25%] gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Class")
                ) : (
                  t("Add Class")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/academic/class")}
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
