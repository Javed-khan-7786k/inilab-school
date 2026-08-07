import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import { useLanguage } from "../../context/LanguageContext";
import type { ExamItem, ClassItem, SectionItem, SubjectItem, Student, ExamAttendanceItem } from "../../types";

export const AddExamAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  // Filter state
  const [examName, setExamName] = useState("");
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Student Attendance Rows State
  const [students, setStudents] = useState<Array<{
    studentId?: string;
    studentName: string;
    roll: string;
    email: string;
    photo?: string;
    status: "Present" | "Absent" | "Late";
  }>>([]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
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
      } catch (err: any) {
        showToast(err.message || t("Failed to load options"), "error");
      }
    };

    fetchInitialData();
  }, [t]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
    setSectionName("");
    setSubjectName("");
  };

  const handleLoadStudents = async () => {
    const errs: Record<string, string> = {};
    if (!examName) errs.examName = t("Exam selection is required");
    if (!className) errs.className = t("Class selection is required");
    if (!subjectName) errs.subjectName = t("Subject selection is required");

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      // 1. Fetch existing attendance records
      const existingAttendance = await dataService.getExamAttendances({
        examName,
        className,
        sectionName: sectionName || undefined,
        subjectName,
      });

      if (existingAttendance && existingAttendance.length > 0) {
        setStudents(
          existingAttendance.map((item) => ({
            studentId: item.studentId,
            studentName: item.studentName,
            roll: item.roll,
            email: item.email,
            photo: item.photo,
            status: item.status,
          }))
        );
      } else {
        // 2. Fetch students from class/section
        const allStudents = await dataService.getStudents();
        const filtered = allStudents.filter((st) => {
          const matchClass = st.className?.toLowerCase() === className.toLowerCase();
          const matchSec = !sectionName || st.sectionName?.toLowerCase() === sectionName.toLowerCase();
          return matchClass && matchSec;
        });

        if (filtered.length === 0) {
          // If no student found in filter, load sample students for demo
          setStudents([
            {
              studentName: "John Doe",
              roll: "101",
              email: "john@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
              status: "Present",
            },
            {
              studentName: "Jane Smith",
              roll: "102",
              email: "jane@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
              status: "Present",
            },
            {
              studentName: "Michael Brown",
              roll: "103",
              email: "michael@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
              status: "Present",
            },
          ]);
        } else {
          setStudents(
            filtered.map((st) => ({
              studentId: String(st.id),
              studentName: st.name,
              roll: st.roll || "101",
              email: st.email || "",
              photo: st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.name}`,
              status: "Present",
            }))
          );
        }
      }
    } catch (err: any) {
      showToast(err.message || t("Failed to load students"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (index: number, status: "Present" | "Absent" | "Late") => {
    setStudents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status };
      return copy;
    });
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      showToast(t("No students to save attendance for"), "error");
      return;
    }

    setSubmitting(true);
    try {
      const records = students.map((st) => ({
        examName,
        className,
        sectionName,
        subjectName,
        studentId: st.studentId,
        studentName: st.studentName,
        roll: st.roll,
        email: st.email,
        photo: st.photo,
        status: st.status,
      }));

      await dataService.saveExamAttendanceBulk(records);
      showToast(t("Exam attendance saved successfully"), "success");
      setTimeout(() => {
        navigate("/dashboard/exam/attendance");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save attendance"), "error");
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

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={"Add Exam Attendance"}
        iconName="fa-check-square-o"
        breadcrumbLabel={"Add Exam Attendance"}
      />

      <div className="p-[20px] bg-bodyBg space-y-6">
        {/* Selection Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-6 max-w-4xl mx-auto">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-4 py-3 -mx-6 -mt-6 mb-6">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Add Exam Attendance")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1">
                {t("Exam")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Exam")}</option>
                {examsList.map((ex) => (
                  <option key={ex.id} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </Select>
              {errors.examName && (
                <p className="text-red-500 text-xs mt-1">{errors.examName}</p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1">
                {t("Class")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={className}
                onChange={handleClassChange}
                className="w-full"
              >
                <option value="">{t("Select Class")}</option>
                {classesList.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.className && (
                <p className="text-red-500 text-xs mt-1">{errors.className}</p>
              )}
            </div>

            {/* Section */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1">
                {t("Section")}
              </label>
              <Select
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Section")}</option>
                {filteredSections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1">
                {t("Subject")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Subject")}</option>
                {filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </Select>
              {errors.subjectName && (
                <p className="text-red-500 text-xs mt-1">{errors.subjectName}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="button" variant="primary" onClick={handleLoadStudents}>
              {t("Exam Attendance")}
            </Button>
          </div>
        </div>

        {/* Student Attendance Entry Table */}
        {students.length > 0 && (
          <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
            <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#444] m-0">
                {t("Attendance List")} ({examName} - {className} - {subjectName})
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#f9f9f9] border-b border-[#e1e1e1] text-[#444] font-semibold">
                      <th className="px-4 py-3 border-r border-[#eee] w-12">#</th>
                      <th className="px-4 py-3 border-r border-[#eee] w-16">{t("Photo")}</th>
                      <th className="px-4 py-3 border-r border-[#eee]">{t("Name")}</th>
                      <th className="px-4 py-3 border-r border-[#eee]">{t("Roll")}</th>
                      <th className="px-4 py-3">{t("Attendance Status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#eee] hover:bg-[#f5f5f5] transition-colors"
                      >
                        <td className="px-4 py-3 border-r border-[#eee]">{idx + 1}</td>
                        <td className="px-4 py-3 border-r border-[#eee]">
                          <img
                            src={
                              st.photo ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.studentName}`
                            }
                            alt={st.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-[#ddd]"
                          />
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee] font-medium text-[#333]">
                          {st.studentName}
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee]">{st.roll}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-green-700">
                              <input
                                type="radio"
                                name={`status_${idx}`}
                                value="Present"
                                checked={st.status === "Present"}
                                onChange={() => handleStatusChange(idx, "Present")}
                                className="accent-green-600 cursor-pointer"
                              />
                              {t("Present")}
                            </label>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-red-700">
                              <input
                                type="radio"
                                name={`status_${idx}`}
                                value="Absent"
                                checked={st.status === "Absent"}
                                onChange={() => handleStatusChange(idx, "Absent")}
                                className="accent-red-600 cursor-pointer"
                              />
                              {t("Absent")}
                            </label>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-yellow-700">
                              <input
                                type="radio"
                                name={`status_${idx}`}
                                value="Late"
                                checked={st.status === "Late"}
                                onChange={() => handleStatusChange(idx, "Late")}
                                className="accent-yellow-600 cursor-pointer"
                              />
                              {t("Late")}
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 border-t border-[#eee] flex items-center justify-end gap-3 bg-[#fcfcfc]">
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveAttendance}
                disabled={submitting}
              >
                {submitting ? <Spinner size="sm" /> : t("Save Attendance")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/exam/attendance")}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>
        )}
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
