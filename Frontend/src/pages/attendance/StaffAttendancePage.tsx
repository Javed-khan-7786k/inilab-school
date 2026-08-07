/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { Icon } from "../../components/ui/Icon";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { userApi } from "../../services/api/userApi";
import { attendanceApi } from "../../services/api/attendanceApi";
import { authService } from "../../services/authService";
import type { UserItem } from "../../types";
import { getPhotoUrl, handleImageError } from "../../Utils/image";

interface StaffAttendancePageProps {
  title?: string;
}

export const StaffAttendancePage: React.FC<StaffAttendancePageProps> = ({
  title = "Staff Attendance",
}) => {
  const { t } = useLanguage();
  const currentUserRole = authService.getUserRole() || "Admin"; // Principal, Admin, Teacher, etc.

  const [staffList, setStaffList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "Present" | "Absent" | "Late" | "Half Day">>({});
  const [isAlreadySaved, setIsAlreadySaved] = useState<boolean>(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStaffData = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Staff/Users list
      const users = await userApi.getAll();
      setStaffList(users);

      // 2. Fetch existing staff attendance records for date
      const records = await attendanceApi.getStaffByDate(date);
      const hasRecords = records && records.length > 0;
      setIsAlreadySaved(hasRecords);

      const initialMap: Record<string, "Present" | "Absent" | "Late" | "Half Day"> = {};
      users.forEach((u) => {
        const found = records.find(
          (r) => String(r.userId) === String(u.id) || String((r as any).userId?._id) === String(u.id)
        );
        initialMap[String(u.id)] = found ? found.status : "Present";
      });

      setAttendanceMap(initialMap);
    } catch (err: any) {
      setError(err.message || "Failed to load staff attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData(selectedDate);
  }, [selectedDate]);

  // Is editing restricted? If records exist and user is NOT Admin (e.g. Principal), lock inputs!
  const isEditingLocked = isAlreadySaved && currentUserRole !== "Admin";

  const handleStatusChange = (userId: string | number, status: "Present" | "Absent" | "Late" | "Half Day") => {
    if (isEditingLocked) return;
    setAttendanceMap((prev) => ({
      ...prev,
      [String(userId)]: status,
    }));
  };

  const handleMarkAll = (status: "Present" | "Absent" | "Late" | "Half Day") => {
    if (isEditingLocked) return;
    const updated: Record<string, "Present" | "Absent" | "Late" | "Half Day"> = {};
    staffList.forEach((u) => {
      updated[String(u.id)] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    if (isEditingLocked) {
      showToast("Only Admin can edit saved staff attendance records.", "error");
      return;
    }

    setSaving(true);
    try {
      const records = staffList.map((u) => ({
        userId: String(u.id),
        status: attendanceMap[String(u.id)] || "Present",
      }));

      await attendanceApi.saveStaffAttendance(selectedDate, records);
      setIsAlreadySaved(true);
      showToast(`🎉 Staff Attendance for ${selectedDate} submitted successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save staff attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = staffList.filter((u) => {
    return (
      searchTerm === "" ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 animate-fadeIn select-none">
        <PageHeaderBar titleKey={title} iconName="fa-user-secret" />

        {/* Permission Banner Notice if Locked */}
        {isEditingLocked && (
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex items-center gap-3 text-amber-800 text-xs font-semibold shadow-sm">
            <Icon name="fa-lock" className="text-lg text-amber-600" />
            <div>
              <span>Staff attendance for <strong className="text-amber-900">{selectedDate}</strong> has already been submitted by Principal/Staff.</span>
              <span className="block text-[11px] font-normal text-amber-700 mt-0.5">Only Administrators can modify saved staff attendance records. Contact Admin to make changes.</span>
            </div>
          </div>
        )}

        {/* Toolbar Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e7eaec] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

            {!isEditingLocked && (
              <div className="flex items-center gap-1.5">
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
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="success"
              disabled={saving || loading || isEditingLocked}
              onClick={handleSaveAttendance}
              className={`font-bold px-5 py-2 rounded shadow-md flex items-center gap-2 text-sm border-0 ${
                isEditingLocked
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
                  : "bg-teal hover:opacity-90 text-white cursor-pointer active:scale-95"
              }`}
            >
              {saving ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon name={isEditingLocked ? "fa-lock" : "fa-save"} />
                  <span>{isEditingLocked ? t("Locked (Admin Only)") : t("Submit Staff Attendance")}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-[#e7eaec] flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => loadStaffData(selectedDate)} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#e7eaec] overflow-hidden">
            <div className="p-4 border-b border-[#e7eaec] bg-[#fdfdfd] flex justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted">{t("Search Staff")}:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("Search staff by name, email or role...")}
                  className="px-3 py-1.5 text-xs border border-[#cbd5e1] rounded w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e7eaec] select-none">
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider w-12">#</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider w-16">Photo</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Staff Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider text-center w-28">Present?</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-bold text-muted uppercase tracking-wider min-w-[240px]">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted text-sm">
                        {t("No staff records found")}
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((u, index) => {
                      const status = attendanceMap[String(u.id)] || "Present";
                      const isPresent = status === "Present";
                      return (
                        <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-sm text-dark font-medium">{index + 1}</td>
                          <td className="px-4 py-3 text-sm">
                            <img
                              src={getPhotoUrl(u.photo)}
                              onError={handleImageError}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#e1e1e1] shadow-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-muted">{u.name}</td>
                          <td className="px-4 py-3 text-sm text-muted font-medium">{u.email}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-teal">{u.role || "Staff"}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <input
                              type="checkbox"
                              checked={isPresent}
                              disabled={isEditingLocked}
                              onChange={(e) => handleStatusChange(u.id, e.target.checked ? "Present" : "Absent")}
                              className={`w-5 h-5 rounded border-gray-300 accent-emerald-600 ${
                                isEditingLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-muted font-medium">{selectedDate}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1.5 flex-nowrap select-none">
                              {(["Present", "Absent", "Late", "Half Day"] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  disabled={isEditingLocked}
                                  onClick={() => handleStatusChange(u.id, st)}
                                  className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                                    isEditingLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                                  } ${
                                    status === st
                                      ? st === "Present"
                                        ? "bg-emerald-600 text-white"
                                        : st === "Absent"
                                        ? "bg-red-600 text-white"
                                        : st === "Late"
                                        ? "bg-amber-500 text-white"
                                        : "bg-sky-600 text-white"
                                      : "bg-[#f1f5f9] text-muted hover:bg-gray-200"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#fdfdfd] border-t border-[#e7eaec] flex justify-between items-center text-xs text-muted">
              <span>Total Staff: {filteredStaff.length}</span>
              <span>Selected Date: <strong className="text-dark">{selectedDate}</strong></span>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold flex items-center gap-2 ${toast.type === "success" ? "bg-[#1abc9c]" : "bg-red-500"}`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
