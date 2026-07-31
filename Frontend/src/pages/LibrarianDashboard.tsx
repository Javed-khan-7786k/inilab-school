/**
 * LibrarianDashboard — The main dashboard page for the Librarian role.
 *
 * Why: This is the page-level component that composes all dashboard sections
 *      (info boxes, profile, notices, calendar) inside the DashboardLayout.
 *      It imports data from constants and passes it as props.
 *
 * Props: none (page component)
 */

import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { InfoBox } from "../components/ui/InfoBox";
import { ProfileCard } from "../components/cards/ProfileCard";
import { NoticeTable } from "../components/tables/NoticeTable";
import { Calendar } from "../components/ui/Calendar";
import { Spinner } from "../components/ui/Spinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { dashboardApi, type DashboardData } from "../services/api/dashboardApi";
import { useApi } from "../hooks/useApi";

export function LibrarianDashboard() {
  const { data: dashboard, loading, error, execute: fetchDashboard } = useApi<DashboardData, [string]>(
    (role) => dashboardApi.getDashboard(role),
    true
  );
  console.log("dashbord",dashboard)

  useEffect(() => {
    fetchDashboard("Librarian");
  }, [fetchDashboard]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-bodyBg flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !dashboard) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage message={error || "Failed to load dashboard"} onRetry={() => fetchDashboard("Librarian")} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Info Boxes */}
      <div className="flex flex-wrap gap-[15px]">
        {dashboard.infoBoxes.map((box) => (
          <InfoBox
            key={box.label}
            value={box.value}
            label={box.label}
            icon={box.icon}
            bgColor={box.bgColor}
          />
        ))}
      </div>

      {/* Profile + Notice Row */}
      <div className="mt-[15px] flex flex-wrap gap-[15px]">
        <div className="min-w-[300px] w-[32%]">
          <ProfileCard
            name={dashboard.profileUser.name}
            role={dashboard.profileUser.role}
            avatarUrl={dashboard.profileUser.avatarUrl}
            details={dashboard.profileDetails}
          />
        </div>
        <div className="min-w-[300px] flex-1">
          
          <NoticeTable notices={dashboard.notices} />
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        month={dashboard.calendarMonth}
        year={dashboard.calendarYear}
        dayNames={dashboard.calendarDayNames}
        weeks={dashboard.calendarWeeks}
      />
    </DashboardLayout>
  );
}
