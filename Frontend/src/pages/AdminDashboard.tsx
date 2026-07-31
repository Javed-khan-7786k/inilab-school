import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { InfoBox } from "../components/ui/InfoBox";
import { ProfileCard } from "../components/cards/ProfileCard";
import { NoticeTable } from "../components/tables/NoticeTable";
import { Calendar } from "../components/ui/Calendar";
import { Spinner } from "../components/ui/Spinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { DashboardHeaderBar } from "../components/dashboard/DashboardHeaderBar";
import { dashboardApi, type DashboardData } from "../services/api/dashboardApi";
import { useApi } from "../hooks/useApi";

export function AdminDashboard() {
    const { data: dashboard, loading, error, execute: fetchDashboard } = useApi<DashboardData, [string]>(
        (role) => dashboardApi.getDashboard(role),
        true
    );

    useEffect(() => {
        fetchDashboard("Admin");
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
                    <ErrorMessage message={error || "Failed to load dashboard"} onRetry={() => fetchDashboard("Admin")} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Top Dashboard Action Header Bar */}
            <DashboardHeaderBar roleName="Admin" />

            {/* Info Boxes Responsive Grid */}
            <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
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
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                <div className="lg:col-span-1 w-full">
                    <ProfileCard
                        name={dashboard.profileUser.name}
                        role={dashboard.profileUser.role}
                        avatarUrl={dashboard.profileUser.avatarUrl}
                        details={dashboard.profileDetails}
                    />
                </div>
                <div className="lg:col-span-2 w-full">
                    <NoticeTable notices={dashboard.notices} />
                </div>
            </div>

            {/* Calendar */}
            <div className="mt-4 w-full overflow-x-auto">
                <Calendar
                    month={dashboard.calendarMonth}
                    year={dashboard.calendarYear}
                    dayNames={dashboard.calendarDayNames}
                    weeks={dashboard.calendarWeeks}
                />
            </div>
        </DashboardLayout>
    );
}
