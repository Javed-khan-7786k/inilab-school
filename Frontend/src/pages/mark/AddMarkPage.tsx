import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { FormRow } from "../../components/common/FormRow";
import { NoteBanner } from "../../components/common/NoteBanner";
import { Toast } from "../../components/ui/Toast";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import { useLanguage } from "../../context/LanguageContext";
import type { ExamItem, ClassItem, SectionItem, SubjectItem, MarkItem } from "../../types";

export const AddMarkPage: React.FC = () => {
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
  const [className, setClassName] = useState("One");
  const [examName, setExamName] = useState("Second Semester");
  const [sectionName, setSectionName] = useState("A");
  const [subjectName, setSubjectName] = useState("Bangla");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Active Mark Details Metadata (displayed after clicking Marks)
  const [activeMeta, setActiveMeta] = useState<{
    examName: string;
    className: string;
    sectionName: string;
    subjectName: string;
  } | null>(null);

  // Mark Rows State
  const [markRows, setMarkRows] = useState<Array<{
    studentId?: string;
    studentName: string;
    roll: string;
    email: string;
    photo?: string;
    examMark: number | string;
    attendanceMark: number | string;
    classTestMark: number | string;
    assignmentMark: number | string;
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

  const handleLoadMarks = async () => {
    const errs: Record<string, string> = {};
    if (!className) errs.className = t("Class selection is required");
    if (!examName) errs.examName = t("Exam selection is required");
    if (!subjectName) errs.subjectName = t("Subject selection is required");

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      // 1. Fetch existing mark records
      const existingMarks = await dataService.getMarks({
        className,
        examName,
        sectionName: sectionName || undefined,
        subjectName,
      });

      setActiveMeta({
        className,
        examName,
        sectionName: sectionName || "A",
        subjectName,
      });

      if (existingMarks && existingMarks.length > 0) {
        setMarkRows(
          existingMarks.map((item) => ({
            studentId: item.studentId,
            studentName: item.studentName,
            roll: item.roll,
            email: item.email,
            photo: item.photo,
            examMark: item.examMark ?? 0,
            attendanceMark: item.attendanceMark ?? 0,
            classTestMark: item.classTestMark ?? 0,
            assignmentMark: item.assignmentMark ?? 0,
          }))
        );
      } else {
        // 2. Fetch sample/class students for initial mark entry
        const allStudents = await dataService.getStudents();
        const filtered = allStudents.filter((st) => {
          const matchClass = st.className?.toLowerCase() === className.toLowerCase();
          const matchSec = !sectionName || st.sectionName?.toLowerCase() === sectionName.toLowerCase();
          return matchClass && matchSec;
        });

        if (filtered.length === 0) {
          // Default sample data specified in user prompt
          setMarkRows([
            {
              studentName: "Brady Harris",
              roll: "1",
              email: "brady@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brady",
              examMark: 30,
              attendanceMark: 4,
              classTestMark: 5,
              assignmentMark: 8,
            },
            {
              studentName: "Demi Wilson",
              roll: "2",
              email: "demi@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demi",
              examMark: 19,
              attendanceMark: 8,
              classTestMark: 0,
              assignmentMark: 1,
            },
            {
              studentName: "Kade Watson",
              roll: "3",
              email: "kade@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kade",
              examMark: 54,
              attendanceMark: 7,
              classTestMark: 9,
              assignmentMark: 2,
            },
            {
              studentName: "August Fowler",
              roll: "4",
              email: "august@example.com",
              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=August",
              examMark: 9,
              attendanceMark: 9,
              classTestMark: 5,
              assignmentMark: 10,
            },
          ]);
        } else {
          setMarkRows(
            filtered.map((st) => ({
              studentId: String(st.id),
              studentName: st.name,
              roll: st.roll || "1",
              email: st.email || "",
              photo: st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.name}`,
              examMark: 0,
              attendanceMark: 0,
              classTestMark: 0,
              assignmentMark: 0,
            }))
          );
        }
      }
    } catch (err: any) {
      showToast(err.message || t("Failed to load marks"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    index: number,
    field: "examMark" | "attendanceMark" | "classTestMark" | "assignmentMark",
    value: string
  ) => {
    const num = value === "" ? "" : Number(value);
    setMarkRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: num };
      return copy;
    });
  };

  const handleSaveMarks = async () => {
    if (!activeMeta) {
      showToast(t("Please click 'Marks' button first to load student list"), "error");
      return;
    }

    setSubmitting(true);
    try {
      const records = markRows.map((row) => ({
        className: activeMeta.className,
        examName: activeMeta.examName,
        sectionName: activeMeta.sectionName,
        subjectName: activeMeta.subjectName,
        studentId: row.studentId,
        studentName: row.studentName,
        roll: row.roll,
        email: row.email,
        photo: row.photo,
        examMark: Number(row.examMark || 0),
        attendanceMark: Number(row.attendanceMark || 0),
        classTestMark: Number(row.classTestMark || 0),
        assignmentMark: Number(row.assignmentMark || 0),
      }));

      await dataService.saveMarksBulk(records);
      showToast(t("Marks added successfully"), "success");
      setTimeout(() => {
        navigate("/dashboard/mark");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save marks"), "error");
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
        titleKey={"Add Mark"}
        iconName="fa-flask"
        breadcrumbLabel={"Add Mark"}
      />

      <div className="p-[20px] bg-bodyBg space-y-6">
        {/* Top Selection Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-6 max-w-4xl mx-auto">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-4 py-3 -mx-6 -mt-6 mb-6">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Add Mark")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Section */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1">
                {t("Section")} <span className="text-red-500">*</span>
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

          {/* Info Note Banner */}
          <div className="mt-4">
            <NoteBanner note={t("Note: Create exam, class, section & subject before add mark")} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="button" variant="primary" onClick={handleLoadMarks}>
              {t("Marks")}
            </Button>
          </div>
        </div>

        {/* Mark Details & Student Marks Table */}
        {activeMeta && (
          <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
            {/* Mark Details Banner */}
            <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-5 py-4">
              <h3 className="text-[16px] font-semibold text-[#444] mb-2">
                {t("Mark Details")}
              </h3>
              <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#555]">
                <div><span className="font-semibold text-[#333]">{t("Exam")} :</span> {activeMeta.examName}</div>
                <div><span className="font-semibold text-[#333]">{t("Class")} :</span> {activeMeta.className}</div>
                <div><span className="font-semibold text-[#333]">{t("Section")} :</span> {activeMeta.sectionName}</div>
                <div><span className="font-semibold text-[#333]">{t("Subject")} :</span> {activeMeta.subjectName}</div>
              </div>
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
                      <th className="px-4 py-3 border-r border-[#eee]">{t("Exam (70)")}</th>
                      <th className="px-4 py-3 border-r border-[#eee]">{t("Attendance (10)")}</th>
                      <th className="px-4 py-3 border-r border-[#eee]">{t("Class Test (10)")}</th>
                      <th className="px-4 py-3">{t("Assignment (10)")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#eee] hover:bg-[#f5f5f5] transition-colors"
                      >
                        <td className="px-4 py-3 border-r border-[#eee]">{idx + 1}</td>
                        <td className="px-4 py-3 border-r border-[#eee]">
                          <img
                            src={
                              row.photo ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.studentName}`
                            }
                            alt={row.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-[#ddd]"
                          />
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee] font-medium text-[#333]">
                          {row.studentName}
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee]">{row.roll}</td>

                        {/* Exam Mark (70) */}
                        <td className="px-4 py-3 border-r border-[#eee] w-28">
                          <Input
                            type="number"
                            min={0}
                            max={70}
                            value={row.examMark}
                            onChange={(e) =>
                              handleInputChange(idx, "examMark", e.target.value)
                            }
                            className="w-full text-center font-semibold"
                          />
                        </td>

                        {/* Attendance Mark (10) */}
                        <td className="px-4 py-3 border-r border-[#eee] w-28">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            value={row.attendanceMark}
                            onChange={(e) =>
                              handleInputChange(idx, "attendanceMark", e.target.value)
                            }
                            className="w-full text-center font-semibold"
                          />
                        </td>

                        {/* Class Test Mark (10) */}
                        <td className="px-4 py-3 border-r border-[#eee] w-28">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            value={row.classTestMark}
                            onChange={(e) =>
                              handleInputChange(idx, "classTestMark", e.target.value)
                            }
                            className="w-full text-center font-semibold"
                          />
                        </td>

                        {/* Assignment Mark (10) */}
                        <td className="px-4 py-3 w-28">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            value={row.assignmentMark}
                            onChange={(e) =>
                              handleInputChange(idx, "assignmentMark", e.target.value)
                            }
                            className="w-full text-center font-semibold"
                          />
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
                onClick={handleSaveMarks}
                disabled={submitting}
              >
                {submitting ? <Spinner size="sm" /> : t("Add marks")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/mark")}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
};
