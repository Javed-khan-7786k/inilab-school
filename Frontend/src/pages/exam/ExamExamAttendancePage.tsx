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
import type { ExamItem, ClassItem, SectionItem, SubjectItem, ExamAttendanceItem } from "../../types";

import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportPdfWithImages,
} from "../../Utils/exportService";

export function ExamExamAttendancePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  // Filter States
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Table Data State
  const [attendances, setAttendances] = useState<ExamAttendanceItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
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
      } catch (err) {
        console.error("Failed to load filter dropdowns", err);
      }
    };

    fetchDropdowns();
    // Initially fetch all attendances
    handleViewAttendance();
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setSelectedSubject("");
  };

  const handleViewAttendance = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await dataService.getExamAttendances({
        examName: selectedExam || undefined,
        className: selectedClass || undefined,
        sectionName: selectedSection || undefined,
        subjectName: selectedSubject || undefined,
      });
      setAttendances(data);
    } catch (err) {
      console.error("Failed to fetch exam attendances", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = selectedClass
    ? sectionsList.filter((s) => s.className.toLowerCase() === selectedClass.toLowerCase())
    : sectionsList;

  const filteredSubjects = selectedClass
    ? subjectsList.filter((sub) => sub.className.toLowerCase() === selectedClass.toLowerCase())
    : subjectsList;

  const filteredAttendances = attendances.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.studentName.toLowerCase().includes(term) ||
      item.roll.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  });

  const exportColumns: ExportColumn[] = [
    { header: "Roll Number", accessorKey: "roll" },
    { header: "Student Name", accessorKey: "studentName" },
    { header: "Email Address", accessorKey: "email" },
    { header: "Exam Name", accessorKey: "examName" },
    { header: "Class", accessorKey: "className" },
    { header: "Section", accessorKey: "sectionName" },
    { header: "Subject", accessorKey: "subjectName" },
    { header: "Status", accessorKey: "status" },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(filteredAttendances, exportColumns);
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const filename = `Exam_Attendance_${selectedExam || "All"}_${selectedClass || "All"}`;
    if (format === "csv") {
      handleExportCsv(filteredAttendances, exportColumns, filename);
    } else if (format === "excel") {
      try {
        await exportExcelWithImages(filteredAttendances, exportColumns, filename, {
          templateUrl: "/template.xlsx",
          imageColumnKey: "photo",
        });
      } catch {
        handleExportCsv(filteredAttendances, exportColumns, filename);
      }
    } else if (format === "pdf") {
      try {
        await exportPdfWithImages(filteredAttendances, exportColumns, filename, {
          imageColumnKey: "photo",
        });
      } catch {
        handleExportCsv(filteredAttendances, exportColumns, filename);
      }
    }
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={"Exam Attendance"}
        iconName="fa-check-square-o"
        breadcrumbLabel={"Exam Attendance"}
      />

      <div className="p-[20px] bg-bodyBg space-y-6">
        {/* Top Action & Filter Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#eee]">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Exam Attendance")}
            </h2>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/dashboard/exam/attendance/add")}
              className="inline-flex items-center gap-2"
            >
              <Icon name="fa-plus" /> {t("Add exam attendance")}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
                {examsList.map((ex) => (
                  <option key={ex.id} value={ex.name}>
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
                {classesList.map((c) => (
                  <option key={c.id} value={c.name}>
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
                {filteredSections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Subject")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full"
              >
                <option value="">{t("Select Subject")}</option>
                {filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Button
                type="button"
                variant="primary"
                onClick={handleViewAttendance}
                className="w-full"
              >
                {t("Exam Attendance")}
              </Button>
            </div>
          </div>
        </div>

        {/* Student Attendance List Table Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-[16px] font-semibold text-[#444] m-0">
              {t("All Students")}
            </h3>

            {/* Export & Search Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center border border-[#d2d6de] rounded overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("excel")}
                  className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("csv")}
                  className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444] font-medium transition-colors cursor-pointer"
                >
                  PDF
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`${t("Search")}:`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-[3px] border border-[#d2d6de] px-3 py-1 text-[12px] focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
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
                    <th className="px-4 py-3 border-r border-[#eee]">{t("Email")}</th>
                    <th className="px-4 py-3">{t("Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                        {t("No data available in table")}
                      </td>
                    </tr>
                  ) : (
                    filteredAttendances.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#eee] hover:bg-[#f5f5f5] transition-colors"
                      >
                        <td className="px-4 py-3 border-r border-[#eee]">{index + 1}</td>
                        <td className="px-4 py-3 border-r border-[#eee]">
                          <img
                            src={
                              item.photo ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.studentName}`
                            }
                            alt={item.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-[#ddd]"
                          />
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee] font-medium text-[#333]">
                          {item.studentName}
                        </td>
                        <td className="px-4 py-3 border-r border-[#eee]">{item.roll}</td>
                        <td className="px-4 py-3 border-r border-[#eee] text-gray-600">
                          {item.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "Present"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {t(item.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-[#fcfcfc] border-t border-[#e1e1e1] px-5 py-3 flex items-center justify-between text-[12px] text-gray-600">
            <div>
              {t("Showing")} {filteredAttendances.length > 0 ? 1 : 0} {t("to")}{" "}
              {filteredAttendances.length} {t("of")} {filteredAttendances.length} {t("entries")}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-3 py-1 border border-[#ddd] bg-gray-100 text-gray-400 rounded cursor-not-allowed"
              >
                {t("Previous")}
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-primary text-white font-medium rounded"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="px-3 py-1 border border-[#ddd] bg-gray-100 text-gray-400 rounded cursor-not-allowed"
              >
                {t("Next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
