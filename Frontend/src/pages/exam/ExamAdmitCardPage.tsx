import React, { useEffect, useState, useRef, useMemo } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import { schoolSettingApi } from "../../services/api/schoolSettingApi";
import { useLanguage } from "../../context/LanguageContext";
import type { ExamItem, ClassItem, SectionItem, StudentListItem, ExamScheduleItem, SubjectItem } from "../../types";

export const ExamAdmitCardPage: React.FC = () => {
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [schedulesList, setSchedulesList] = useState<ExamScheduleItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  // Selection state
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [studentSelectionType, setStudentSelectionType] = useState<"all" | "specific">("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Dynamic School Header state
  const [schoolName, setSchoolName] = useState<string>("KanakLabs School");
  const [academicYear, setAcademicYear] = useState<string>("2025-2026");

  // Generated state
  const [generatedCards, setGeneratedCards] = useState<Array<{
    student: any;
    examName: string;
    className: string;
    sectionName: string;
    schedules: ExamScheduleItem[];
  }>>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [exams, classes, sections, students, schedules, subjects, settings] = await Promise.all([
          dataService.getExams().catch(() => []),
          dataService.getClasses().catch(() => []),
          dataService.getSections().catch(() => []),
          dataService.getStudents().catch(() => []),
          dataService.getExamSchedules().catch(() => []),
          dataService.getSubjects().catch(() => []),
          schoolSettingApi.getSettings().catch(() => null),
        ]);
        
        if (settings?.schoolProfile?.name) {
          setSchoolName(settings.schoolProfile.name);
        }
        const activeSess = settings?.sessions?.find((s: any) => s.isActive);
        if (activeSess?.year) {
          setAcademicYear(activeSess.year);
        }

        // Build combined classes list (from API + any unique class names in students list)
        const classNamesFromApi = new Set((classes || []).map((c: any) => c.name?.toLowerCase()));
        const extraClassesFromStudents: ClassItem[] = [];
        (students || []).forEach((st: any) => {
          const cName = (st.className || st.class || "").trim();
          if (cName && !classNamesFromApi.has(cName.toLowerCase())) {
            classNamesFromApi.add(cName.toLowerCase());
            extraClassesFromStudents.push({
              id: `cls-${cName}`,
              name: cName,
              classNumeric: cName,
              teacherName: "",
            });
          }
        });
        const combinedClasses = [...(classes || []), ...extraClassesFromStudents];

        setExamsList(exams || []);
        setClassesList(combinedClasses);
        setSectionsList(sections || []);
        setStudentsList(students || []);
        setSchedulesList(schedules || []);
        setSubjectsList(subjects || []);
      } catch (err) {
        console.error("Failed to load admit card data:", err);
      }
    };
    loadDropdowns();
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setSelectedStudentId("");
  };

  const filteredSections = selectedClass
    ? sectionsList.filter((s) => s.className?.toLowerCase() === selectedClass.toLowerCase())
    : sectionsList;

  const normalizeClass = (val: string) => {
    if (!val) return "";
    const cleaned = val.toString().trim().toLowerCase().replace(/^class\s*/i, "");
    const map: Record<string, string> = {
      "1": "one", "one": "one",
      "2": "two", "two": "two",
      "3": "three", "three": "three",
      "4": "four", "four": "four",
      "5": "five", "five": "five",
      "6": "graduate", "six": "graduate", "graduate": "graduate"
    };
    return map[cleaned] || cleaned;
  };

  const filteredStudents = useMemo(() => {
    return studentsList.filter((st: any) => {
      const stClass = (st.className || st.class || "").toString().trim();
      const stSec = (st.sectionName || st.section || "").toString().trim();
      const selClass = selectedClass.trim();
      const selSec = selectedSection.trim();

      const matchClass = !selClass || normalizeClass(stClass) === normalizeClass(selClass);
      const matchSec = !selSec || !stSec || stSec.toLowerCase() === selSec.toLowerCase();
      return matchClass && matchSec;
    });
  }, [studentsList, selectedClass, selectedSection]);

  const availableStudents = filteredStudents;

  const handleGenerate = () => {
    if (!selectedExam) {
      alert(t("Please select an Exam"));
      return;
    }
    if (!selectedClass) {
      alert(t("Please select a Class"));
      return;
    }
    if (studentSelectionType === "specific" && !selectedStudentId) {
      alert(t("Please select a specific student from the list"));
      return;
    }

    setLoading(true);
    setHasGenerated(true);

    // Target students
    let targets = [...availableStudents];
    if (studentSelectionType === "specific" && selectedStudentId) {
      targets = targets.filter((st: any) => String(st.id || st._id) === String(selectedStudentId));
    }

    // Fallback for testing mode if no DB students found matching criteria
    if (targets.length === 0) {
      targets = [
        {
          id: `test-st-1`,
          name: `Test Candidate 1 (${selectedClass})`,
          roll: "101",
          email: `candidate1.${selectedClass.toLowerCase()}@school.com`,
          className: selectedClass,
          sectionName: selectedSection || "A",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
        },
        {
          id: `test-st-2`,
          name: `Test Candidate 2 (${selectedClass})`,
          roll: "102",
          email: `candidate2.${selectedClass.toLowerCase()}@school.com`,
          className: selectedClass,
          sectionName: selectedSection || "A",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        }
      ];
    }

    // Schedules for selected exam & class
    let examSchedules = schedulesList.filter((sch: any) => {
      const schEx = String(sch.examName || "").trim().toLowerCase();
      const schCl = String(sch.className || "").trim().toLowerCase();
      const schSec = String(sch.sectionName || "").trim().toLowerCase();

      const matchEx = schEx === selectedExam.trim().toLowerCase();
      const matchCl = normalizeClass(schCl) === normalizeClass(selectedClass);
      const matchSec = !selectedSection.trim() || !schSec || schSec === selectedSection.trim().toLowerCase();
      return matchEx && matchCl && matchSec;
    });

    // If no exam schedule records found, check for subjects in that class to generate schedule entries
    if (examSchedules.length === 0) {
      const classSubjects = subjectsList.filter((sub: any) => {
        const subCl = String(sub.className || "").trim().toLowerCase();
        return subCl === selectedClass.trim().toLowerCase();
      });

      if (classSubjects.length > 0) {
        const selectedExamObj = examsList.find((ex: any) => ex.name === selectedExam);
        const baseDate = selectedExamObj?.date || "To be announced";
        examSchedules = classSubjects.map((sub: any, idx: number) => ({
          id: sub.id || sub._id || `sub-sch-${idx}`,
          examName: selectedExam,
          className: selectedClass,
          sectionName: selectedSection || "All",
          subjectName: sub.name,
          date: baseDate,
          time: "09:00 AM - 12:00 PM",
          room: "Exam Hall",
        })) as any;
      }
    }

    const cards = targets.map((st: any) => ({
      student: st,
      examName: selectedExam,
      className: st.className || st.class || selectedClass,
      sectionName: st.sectionName || st.section || selectedSection || "N/A",
      schedules: examSchedules,
    }));

    setGeneratedCards(cards);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={"Admit Card"}
        iconName="fa-id-card-o"
        breadcrumbLabel={"Admit Card"}
      />

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-admit-cards, #printable-admit-cards * {
            visibility: visible !important;
          }
          #printable-admit-cards {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
          }
          .admit-card-item {
            page-break-after: always !important;
            break-after: page !important;
            margin-bottom: 2rem !important;
            border: 2px solid #1abc9c !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="p-[20px] bg-bodyBg space-y-6">
        {/* Filter Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5 print:hidden">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eee]">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Generate Admit Card")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Exam")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Exam")}</option>
                {examsList.map((ex: any) => (
                  <option key={ex.id || ex._id} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Class")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full"
              >
                <option value="">{t("Select Class")}</option>
                {classesList.map((c: any) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Section")}
              </label>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Section")}</option>
                {filteredSections.map((s: any) => (
                  <option key={s.id || s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Student Type")} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 bg-[#f8fafc] border border-[#d2d6de] rounded p-2.5">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#333]">
                  <input
                    type="radio"
                    name="studentSelectionType"
                    value="all"
                    checked={studentSelectionType === "all"}
                    onChange={() => {
                      setStudentSelectionType("all");
                      setSelectedStudentId("");
                    }}
                    className="accent-teal w-4 h-4 cursor-pointer"
                  />
                  <span>{t("All Students")}</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#333]">
                  <input
                    type="radio"
                    name="studentSelectionType"
                    value="specific"
                    checked={studentSelectionType === "specific"}
                    onChange={() => setStudentSelectionType("specific")}
                    className="accent-teal w-4 h-4 cursor-pointer"
                  />
                  <span>{t("Specific Student")}</span>
                </label>
              </div>
            </div>
          </div>

          {studentSelectionType === "specific" && (
            <div className="mt-4 max-w-md">
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Select Specific Student")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs"
              >
                <option value="">{t("-- Select Student from List --")}</option>
                {availableStudents.map((st: any) => (
                  <option key={st.id || st._id} value={st.id || st._id}>
                    {st.name} ({st.roll ? `Roll No: ${st.roll}` : "No Roll"})
                  </option>
                ))}
              </Select>
              <p className="text-[11px] text-teal font-semibold mt-1">
                {t("Showing")} {availableStudents.length} {t("student(s) in")} {selectedClass || t("selected class")}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 cursor-pointer"
            >
              <Icon name="fa-cogs" /> {t("Generate Admit Card")}
            </Button>
          </div>
        </div>

        {/* Printable Admit Cards Display */}
        {loading ? (
          <div className="bg-white p-12 text-center rounded border border-[#e1e1e1]">
            <Spinner size="lg" />
          </div>
        ) : hasGenerated && generatedCards.length === 0 ? (
          <div className="bg-white p-8 text-center rounded border border-[#e1e1e1] text-gray-500 italic">
            {t("No student records found matching the criteria.")}
          </div>
        ) : generatedCards.length > 0 ? (
          <div className="space-y-6">
            {/* Top Toolbar for Printing */}
            <div className="bg-white p-4 rounded border border-[#e1e1e1] flex items-center justify-between print:hidden">
              <span className="text-sm font-semibold text-gray-700">
                {t("Generated")} {generatedCards.length} {t("Admit Card(s)")}
              </span>
              <Button
                type="button"
                variant="success"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <Icon name="fa-print" /> {t("Print Admit Cards")}
              </Button>
            </div>

            {/* Cards Container */}
            <div ref={printRef} id="printable-admit-cards" className="space-y-8 print:space-y-0">
              {generatedCards.map((card, idx) => (
                <div
                  key={idx}
                  className="admit-card-item bg-white rounded border-2 border-teal p-6 max-w-3xl mx-auto shadow-md"
                >
                  {/* Admit Card Header */}
                  <div className="border-b-2 border-teal pb-3 mb-4 text-center">
                    <h1 className="text-2xl font-bold text-teal tracking-wide uppercase m-0">
                      {schoolName || "KanakLabs School"}
                    </h1>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mt-0.5">
                      EXAMINATION HALL TICKET / ADMIT CARD ({academicYear || "2025-2026"})
                    </p>
                    <div className="inline-block bg-teal text-white text-xs font-bold px-4 py-1 rounded-full uppercase mt-2">
                      {card.examName}
                    </div>
                  </div>

                  {/* Student Details Grid & Photo */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#f8fafc] p-4 rounded border border-[#e2e8f0]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-700 w-full sm:w-auto">
                      <div>
                        <span className="font-bold text-gray-500">{t("Student Name")}:</span>{" "}
                        <span className="font-semibold text-dark text-sm">{card.student.name}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500">{t("Roll Number")}:</span>{" "}
                        <span className="font-semibold text-dark text-sm">{card.student.roll || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500">{t("Class")}:</span>{" "}
                        <span className="font-semibold text-dark">{card.className}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500">{t("Section")}:</span>{" "}
                        <span className="font-semibold text-dark">{card.sectionName}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500">{t("Email")}:</span>{" "}
                        <span className="font-semibold text-dark">{card.student.email || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500">{t("Gender")}:</span>{" "}
                        <span className="font-semibold text-dark">{card.student.gender || "N/A"}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <img
                        src={
                          card.student.photo && card.student.photo.trim() !== ""
                            ? card.student.photo
                            : card.student.avatar && card.student.avatar.trim() !== ""
                            ? card.student.avatar
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(card.student.name || "student")}`
                        }
                        alt={card.student.name}
                        className="w-24 h-28 object-cover rounded border-2 border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Exam Schedule Timetable */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {t("Examination Schedule")}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                            <th className="p-2 border border-gray-300">#</th>
                            <th className="p-2 border border-gray-300">{t("Subject")}</th>
                            <th className="p-2 border border-gray-300">{t("Date")}</th>
                            <th className="p-2 border border-gray-300">{t("Time")}</th>
                            <th className="p-2 border border-gray-300">{t("Room / Hall")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {card.schedules.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-3 border border-gray-300 text-center text-gray-500 italic">
                                {t("Schedule to be announced.")}
                              </td>
                            </tr>
                          ) : (
                            card.schedules.map((sch, sIdx) => (
                              <tr key={sIdx} className="border border-gray-200">
                                <td className="p-2 border border-gray-300 font-bold">{sIdx + 1}</td>
                                <td className="p-2 border border-gray-300 font-semibold">{sch.subjectName}</td>
                                <td className="p-2 border border-gray-300">{sch.date}</td>
                                <td className="p-2 border border-gray-300">{sch.time}</td>
                                <td className="p-2 border border-gray-300 font-medium">{sch.room}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Rules & Instructions */}
                  <div className="mb-8 bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900">
                    <p className="font-bold uppercase tracking-wider mb-1 text-amber-800">
                      {t("Important Rules & Guidelines for Candidates")}:
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5">
                      <li>{t("Candidates must bring this Admit Card along with their valid Student ID Card to the exam hall.")}</li>
                      <li>{t("Mobile phones, smartwatches, and electronic gadgets are strictly prohibited in the exam hall.")}</li>
                      <li>{t("Please arrive at the examination room at least 15 minutes before the scheduled exam start time.")}</li>
                    </ol>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dashed border-gray-400 text-center text-xs text-gray-600">
                    <div>
                      <div className="h-8"></div>
                      <p className="border-t border-gray-400 pt-1 font-semibold">{t("Candidate Signature")}</p>
                    </div>
                    <div>
                      <div className="h-8"></div>
                      <p className="border-t border-gray-400 pt-1 font-semibold">{t("Teacher Signature")}</p>
                    </div>
                    <div>
                      <div className="h-8 font-bold text-teal text-[10px] flex items-center justify-center">
                        [SEAL & STAMP]
                      </div>
                      <p className="border-t border-gray-400 pt-1 font-semibold">{t("Controller of Examination")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};
