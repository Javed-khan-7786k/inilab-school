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
import type { ClassItem, SectionItem, SubjectItem, ExamItem } from "../../types";

export const AddExamSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [examName, setExamName] = useState("");
  const [examId, setExamId] = useState("");
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM - 12:00 PM");
  const [room, setRoom] = useState("");

  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [exams, classes, sections, subjects] = await Promise.all([
          dataService.getExams(),
          dataService.getClasses(),
          dataService.getSections(),
          dataService.getSubjects(),
        ]);
        setExamsList(exams);
        setClassesList(classes);
        setSectionsList(sections);
        setSubjectsList(subjects);

        if (isEditMode && id) {
          const scheduleData = await dataService.getExamScheduleById(id);
          setExamName(scheduleData.examName || "");
          setExamId(scheduleData.examId || "");
          setClassName(scheduleData.className || "");
          setClassId(scheduleData.classId || "");
          setSectionName(scheduleData.sectionName || "");
          setSectionId(scheduleData.sectionId || "");
          setSubjectName(scheduleData.subjectName || "");
          setSubjectId(scheduleData.subjectId || "");
          setDate(scheduleData.date || "");
          setTime(scheduleData.time || "09:00 AM - 12:00 PM");
          setRoom(scheduleData.room || "");
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load schedule data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!examName.trim()) errs.examName = t("Exam name selection is required");
    if (!className.trim()) errs.className = t("Class selection is required");
    if (!sectionName.trim()) errs.sectionName = t("Section selection is required");
    if (!subjectName.trim()) errs.subjectName = t("Subject selection is required");
    if (!date.trim()) errs.date = t("Date is required");
    if (!time.trim()) errs.time = t("Time is required");
    if (!room.trim()) errs.room = t("Room is required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setExamName(selectedName);
    const selectedExam = examsList.find((ex) => ex.name === selectedName);
    if (selectedExam) {
      setExamId(String(selectedExam.id));
    } else {
      setExamId("");
    }
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

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSectionName(selectedName);
    const selectedSection = sectionsList.find((s) => s.name === selectedName);
    if (selectedSection) {
      setSectionId(String(selectedSection.id));
    } else {
      setSectionId("");
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSubjectName(selectedName);
    const selectedSubject = subjectsList.find((sub) => sub.name === selectedName);
    if (selectedSubject) {
      setSubjectId(String(selectedSubject.id));
    } else {
      setSubjectId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        examName,
        examId,
        className,
        classId,
        sectionName,
        sectionId,
        subjectName,
        subjectId,
        date,
        time,
        room,
      };

      if (isEditMode && id) {
        await dataService.updateExamSchedule(id, payload);
        showToast(t("Exam schedule updated successfully"), "success");
      } else {
        await dataService.addExamSchedule(payload);
        showToast(t("Exam schedule added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/exam/schedule");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save exam schedule"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSections = className
    ? sectionsList.filter((s) => s.className.toLowerCase() === className.toLowerCase())
    : sectionsList;

  const filteredSubjects = className
    ? subjectsList.filter((sub) => sub.className.toLowerCase() === className.toLowerCase())
    : subjectsList;

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
        titleKey={isEditMode ? "Edit Exam Schedule" : "Add Exam Schedule"}
        iconName="fa-calendar"
        breadcrumbLabel={isEditMode ? "Edit Exam Schedule" : "Add Exam Schedule"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Exam Schedule") : t("Add Exam Schedule")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Exam Name Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Exam Name")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={examName}
                  onChange={handleExamChange}
                  className="w-full"
                >
                  <option value="">{t("Select Exam")}</option>
                  {examsList.map((exItem) => (
                    <option key={exItem.id} value={exItem.name}>
                      {exItem.name}
                    </option>
                  ))}
                </Select>
                {errors.examName && (
                  <p className="text-red-500 text-xs mt-1">{errors.examName}</p>
                )}
              </div>
            </div>

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

            {/* Section Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Section")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={sectionName}
                  onChange={handleSectionChange}
                  className="w-full"
                >
                  <option value="">{t("Select Section")}</option>
                  {filteredSections.map((sItem) => (
                    <option key={sItem.id} value={sItem.name}>
                      {sItem.name} ({sItem.category})
                    </option>
                  ))}
                </Select>
                {errors.sectionName && (
                  <p className="text-red-500 text-xs mt-1">{errors.sectionName}</p>
                )}
              </div>
            </div>

            {/* Subject Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Subject")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={subjectName}
                  onChange={handleSubjectChange}
                  className="w-full"
                >
                  <option value="">{t("Select Subject")}</option>
                  {filteredSubjects.map((subItem) => (
                    <option key={subItem.id} value={subItem.name}>
                      {subItem.name} ({subItem.code})
                    </option>
                  ))}
                </Select>
                {errors.subjectName && (
                  <p className="text-red-500 text-xs mt-1">{errors.subjectName}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Date")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 10 Jan 2025"
                  className="w-full"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Time")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:00 AM - 12:00 PM"
                  className="w-full"
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Room */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Room")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. 101"
                  className="w-full"
                />
                {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Exam Schedule")
                ) : (
                  t("Add Exam Schedule")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/exam/schedule")}
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
