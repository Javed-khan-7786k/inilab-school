import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { FormRow } from "../../components/common/FormRow";
import { NoteBanner } from "../../components/common/NoteBanner";
import { Toast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import type { ClassItem, SectionItem, SubjectItem, Teacher } from "../../types";

export const AddRoutinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [schoolYear, setSchoolYear] = useState("2025-2026 (Default)");
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [day, setDay] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [startingTime, setStartingTime] = useState("08:45 AM");
  const [endingTime, setEndingTime] = useState("09:30 AM");
  const [room, setRoom] = useState("");

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const daysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [classes, sections, subjects, teachers] = await Promise.all([
          dataService.getClasses(),
          dataService.getSections(),
          dataService.getSubjects(),
          dataService.getTeachers(),
        ]);
        setClassesList(classes);
        setSectionsList(sections);
        setSubjectsList(subjects);
        setTeachersList(teachers);

        if (isEditMode && id) {
          const routineData = await dataService.getRoutineById(id);
          setSchoolYear(routineData.schoolYear || "2025-2026 (Default)");
          setClassName(routineData.className || "");
          setClassId(routineData.classId || "");
          setSectionName(routineData.sectionName || "");
          setSectionId(routineData.sectionId || "");
          setSubjectName(routineData.subjectName || "");
          setSubjectId(routineData.subjectId || "");
          setDay(routineData.day || "");
          setTeacherName(routineData.teacherName || "");
          setTeacherId(routineData.teacherId || "");
          setStartingTime(routineData.startingTime || "08:45 AM");
          setEndingTime(routineData.endingTime || "09:30 AM");
          setRoom(routineData.room || "");
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load routine data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!schoolYear.trim()) errs.schoolYear = t("School year is required");
    if (!className.trim()) errs.className = t("Class selection is required");
    if (!sectionName.trim()) errs.sectionName = t("Section selection is required");
    if (!subjectName.trim()) errs.subjectName = t("Subject selection is required");
    if (!day.trim()) errs.day = t("Day selection is required");
    if (!teacherName.trim()) errs.teacherName = t("Teacher selection is required");
    if (!startingTime.trim()) errs.startingTime = t("Starting time is required");
    if (!endingTime.trim()) errs.endingTime = t("Ending time is required");
    if (!room.trim()) errs.room = t("Room is required");
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
        schoolYear,
        className,
        classId,
        sectionName,
        sectionId,
        subjectName,
        subjectId,
        day,
        teacherName,
        teacherId,
        startingTime,
        endingTime,
        room,
      };

      if (isEditMode && id) {
        await dataService.updateRoutine(id, payload);
        showToast(t("Routine updated successfully"), "success");
      } else {
        await dataService.addRoutine(payload);
        showToast(t("Routine added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/academic/routine");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save routine"), "error");
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
        titleKey={isEditMode ? "Edit Routine" : "Add Routine"}
        iconName="fa-calendar"
        breadcrumbLabel={isEditMode ? "Edit Routine" : "Add Routine"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Routine") : t("Add Routine")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* School Year */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("School Year")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  className="w-full"
                >
                  <option value="2025-2026 (Default)">2025-2026 (Default)</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2026-2027">2026-2027</option>
                </Select>
                {errors.schoolYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.schoolYear}</p>
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

            {/* Day Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Day")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full"
                >
                  <option value="">{t("Select Day")}</option>
                  {daysOptions.map((d) => (
                    <option key={d} value={d}>
                      {t(d)}
                    </option>
                  ))}
                </Select>
                {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Teacher")} <span className="text-red-500">*</span>
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

            {/* Starting Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Starting Time")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={startingTime}
                  onChange={(e) => setStartingTime(e.target.value)}
                  placeholder="e.g. 08:45 AM"
                  className="w-full"
                />
                {errors.startingTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.startingTime}</p>
                )}
              </div>
            </div>

            {/* Ending Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Ending Time")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={endingTime}
                  onChange={(e) => setEndingTime(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  className="w-full"
                />
                {errors.endingTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.endingTime}</p>
                )}
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

            {/* Info Note Banner */}
            <NoteBanner note={t("Note: Make teacher, class, subject & section before you add routine")} />

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Routine")
                ) : (
                  t("Add Routine")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/academic/routine")}
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
