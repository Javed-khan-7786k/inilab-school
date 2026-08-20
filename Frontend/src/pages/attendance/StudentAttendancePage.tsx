/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { Icon } from "../../components/ui/Icon";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { studentApi } from "../../services/api/studentApi";
import { attendanceApi } from "../../services/api/attendanceApi";
import { dataService } from "../../services/dataService";
import type { Student } from "../../types";
import { getPhotoUrl, handleImageError } from "../../Utils/image";
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportPdfWithImages,
} from "../../Utils/exportService";

export const StudentAttendancePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Date State (Defaults to Today's date YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Attendance Statuses State: Map of studentId -> 'Present' | 'Absent' | 'Late' | 'Half Day'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "Present" | "Absent" | "Late" | "Half Day">>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDataForDate = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Students & Classes from DB
      const [studentList, dbClasses] = await Promise.all([
        studentApi.getAll(),
        dataService.getClasses().catch(() => []),
      ]);
      setStudents(studentList);

      const classSet = new Set<string>();
      if (Array.isArray(dbClasses)) {
        dbClasses.forEach((c) => { if (c.name) classSet.add(c.name.trim()); });
      }
      if (Array.isArray(studentList)) {
        studentList.forEach((st: any) => { if (st.className) classSet.add(st.className.trim()); });
      }
      const sortedClasses = Array.from(classSet).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10);
        const numB = parseInt(b.replace(/\D/g, ''), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });
      setClassesList(sortedClasses);

      // 2. Fetch existing Attendance records from DB for the selected date
      const attendanceList = await attendanceApi.getByDate(date);

      // Build map of existing attendance status
      const initialMap: Record<string, "Present" | "Absent" | "Late" | "Half Day"> = {};
      studentList.forEach((st) => {
        const found = attendanceList.find(
          (att) => String(att.studentId) === String(st.id) || String((att as any).studentId?.id) === String(st.id)
        );
        initialMap[String(st.id)] = found ? found.status : "Present";
      });

      setAttendanceMap(initialMap);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate]);

  const handleStatusChange = (studentId: string | number, status: "Present" | "Absent" | "Late" | "Half Day") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [String(studentId)]: status,
    }));
  };

  const handleMarkAll = (status: "Present" | "Absent" | "Late" | "Half Day") => {
    const updated: Record<string, "Present" | "Absent" | "Late" | "Half Day"> = {};
    students.forEach((st) => {
      updated[String(st.id)] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const records = students.map((st) => ({
        studentId: String(st.id),
        studentName: st.name,
        status: attendanceMap[String(st.id)] || "Present",
        className: st.className || "",
      }));

      await attendanceApi.saveAttendance(selectedDate, records);
      showToast(`🎉 Attendance for ${selectedDate} saved to DB successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save attendance to DB", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filter Students
  const filteredStudents = students.filter((st) => {
    const matchesClass = selectedClass === "" || st.className === selectedClass;
    const matchesSearch =
      searchTerm === "" ||
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(st.roll).includes(searchTerm) ||
      (st.email && st.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  // Export Columns
  const exportColumns: ExportColumn[] = [
    { header: "Roll", accessorKey: "roll" },
    { header: "Name", accessorKey: "name" },
    { header: "Class", accessorKey: "className" },
    { header: "Attendance Date", accessorKey: "attendanceDate" },
    { header: "Status", accessorKey: "attendanceStatus" },
    { header: "Photo", accessorKey: "photo" },
  ];

  const preparedExportData = filteredStudents.map((st) => ({
    ...st,
    attendanceDate: selectedDate,
    attendanceStatus: attendanceMap[String(st.id)] || "Present",
  }));

  const handleCopy = () => {
    handleCopyToClipboard(preparedExportData, exportColumns);
    showToast(t("Copied to clipboard"), "success");
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const filename = `Student_Attendance_${selectedDate}`;
    if (format === "csv") {
      handleExportCsv(preparedExportData, exportColumns, filename);
    } else if (format === "excel") {
      await exportExcelWithImages(preparedExportData, exportColumns, filename, {
        imageColumnKey: "photo",
      });
    } else if (format === "pdf") {
      await exportPdfWithImages(preparedExportData, exportColumns, filename, {
        imageColumnKey: "photo",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 animate-fadeIn select-none">
        <PageHeaderBar titleKey="Student Attendance" iconName="fa-user-secret" />

        {/* Toolbar Header Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e7eaec] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Left: Date Picker & Class Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#cbd5e1] rounded px-3 py-1.5 shadow-sm">
              <Icon name="fa-calendar" className="text-teal text-base" />
              <label className="text-[12px] font-bold text-muted uppercase tracking-wider">{t("Date")}:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-dark focus:outline-none cursor-pointer"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 bg-white border border-[#cbd5e1] rounded text-sm font-medium text-dark focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="">{t("All Classes")}</option>
              {classesList.map((clsName) => (
                <option key={clsName} value={clsName}>
                  {clsName}
                </option>
              ))}
            </select>

            {/* Quick Action: Mark All Present / Absent */}
            <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMarkAll("Present")}
                className="text-[12px] px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold"
              >
                ✓ All Present
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMarkAll("Absent")}
                className="text-[12px] px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold"
              >
                ✕ All Absent
              </Button>
            </div>
          </div>

          {/* Right: Save Attendance to DB Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="success"
              disabled={saving || loading}
              onClick={handleSaveAttendance}
              className="bg-teal hover:opacity-90 text-white font-bold px-5 py-2 rounded shadow-md flex items-center gap-2 text-sm border-0 cursor-pointer active:scale-95"
            >
              {saving ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon name="fa-save" />
                  <span>{t("Save Attendance to DB")}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Body */}
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-[#e7eaec] flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => loadDataForDate(selectedDate)} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#e7eaec] overflow-hidden">
            
            {/* Export & Search Controls */}
            <div className="p-4 border-b border-[#e7eaec] bg-[#fdfdfd] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-1 select-none">
                <Button variant="secondary" size="sm" onClick={handleCopy} className="text-xs bg-[#f4f4f4] border-[#dcdcdc]">
                  {t("Copy")}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport("excel")} className="text-xs bg-[#f4f4f4] border-[#dcdcdc]">
                  {t("Excel")}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport("csv")} className="text-xs bg-[#f4f4f4] border-[#dcdcdc]">
                  {t("CSV")}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport("pdf")} className="text-xs bg-[#f4f4f4] border-[#dcdcdc]">
                  {t("PDF")}
                </Button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted">{t("Search")}:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("Search by student name or roll...")}
                  className="px-3 py-1.5 text-xs border border-[#cbd5e1] rounded w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e7eaec] select-none">
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider w-12">#</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider w-16">Photo</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Student Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Roll</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-center w-28">Present?</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider min-w-[240px]">Attendance Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider w-20 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted text-sm">
                        {t("No student records found")}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st, index) => {
                      const status = attendanceMap[String(st.id)] || "Present";
                      const isPresent = status === "Present";
                      return (
                        <tr key={st.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-sm text-dark font-medium">{index + 1}</td>
                          <td className="px-4 py-3 text-sm">
                            <img
                              src={getPhotoUrl(st.photo)}
                              onError={handleImageError}
                              alt={st.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#e1e1e1] shadow-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-muted">{st.name}</td>
                          <td className="px-4 py-3 text-sm text-muted font-medium">{st.roll}</td>
                          <td className="px-4 py-3 text-sm text-muted font-medium">{st.className || "-"}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <input
                              type="checkbox"
                              checked={isPresent}
                              onChange={(e) => handleStatusChange(st.id, e.target.checked ? "Present" : "Absent")}
                              className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                              title={isPresent ? "Checked: Present (Uncheck to mark Absent)" : "Unchecked: Absent"}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-muted font-medium">{selectedDate}</td>
                          <td className="px-4 py-3 text-sm">
                            {/* Attendance Status Radio Pill Buttons */}
                            <div className="flex items-center gap-1.5 flex-nowrap select-none">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "Present")}
                                className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                  status === "Present"
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-[#f1f5f9] text-muted hover:bg-emerald-100 hover:text-emerald-700"
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "Absent")}
                                className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                  status === "Absent"
                                    ? "bg-red-600 text-white shadow-sm"
                                    : "bg-[#f1f5f9] text-muted hover:bg-red-100 hover:text-red-700"
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "Late")}
                                className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                  status === "Late"
                                    ? "bg-amber-500 text-white shadow-sm"
                                    : "bg-[#f1f5f9] text-muted hover:bg-amber-100 hover:text-amber-700"
                                }`}
                              >
                                Late
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "Half Day")}
                                className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                  status === "Half Day"
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "bg-[#f1f5f9] text-muted hover:bg-sky-100 hover:text-sky-700"
                                }`}
                              >
                                Half Day
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {/* ONLY View Option */}
                            <button
                              type="button"
                              onClick={() => navigate(`/dashboard/view/student-attendance/Attendence/${st.id}`)}
                              title={t("View Details")}
                              className="inline-block rounded-[3px] bg-action px-[8px] py-[5px] text-[13px] text-white cursor-pointer hover:opacity-90 transition-opacity border-0"
                            >
                              <Icon name="fa-check-square-o" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer summary */}
            <div className="p-4 bg-[#fdfdfd] border-t border-[#e7eaec] flex justify-between items-center text-xs text-muted">
              <span>Total Students: {filteredStudents.length}</span>
              <span>Selected Date: <strong className="text-dark">{selectedDate}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${toast.type === "success" ? "bg-teal bg-[#1abc9c]" : "bg-red-500"}`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
