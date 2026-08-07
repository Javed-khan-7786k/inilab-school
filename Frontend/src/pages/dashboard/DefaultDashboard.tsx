import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { DashboardHeaderBar } from "../../components/dashboard/DashboardHeaderBar";
import { useLanguage } from "../../context/LanguageContext";

export function DefaultDashboard() {
  const userRole = sessionStorage.getItem("userRole") || "User";
  const userName = sessionStorage.getItem("userName") || "Guest";
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <DashboardHeaderBar roleName={userRole} />
      <div className="bg-white rounded-lg p-6 shadow-sm border border-brdr">
        <h2 className="text-[22px] font-bold text-secondary mb-2">
          {t(`Welcome to the ${userRole} Dashboard!`)}
        </h2>
        <p className="text-muted text-sm">
          {t(`Hello ${userName}, you are successfully logged in.`)}
        </p>
      </div>
    </DashboardLayout>
  );
}
