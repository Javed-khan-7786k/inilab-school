import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";

interface DashboardHeaderBarProps {
  roleName?: string;
}

export const DashboardHeaderBar: React.FC<DashboardHeaderBarProps> = ({ roleName = "Dashboard" }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const Role=roleName==="Admin"||roleName==="Receptionist"
 

  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-brdr flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h2 className="text-lg font-bold text-dark flex items-center gap-2">
          <Icon name="fa-laptop" className="text-teal" />
          <span>{t(`${roleName} Overview`)}</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">
          {t("Welcome back! Here is a summary of school operations and quick actions.")}
        </p>
      </div>

     { Role &&(
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
        <Button
          variant="success"
          onClick={() => navigate("/dashboard/enquiry/new")}
          className="bg-teal hover:bg-[#16a085] text-white font-bold px-4 py-2 rounded shadow-sm text-xs border-0 cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
        >
          <Icon name="fa-plus-circle" className="text-sm" />
          <span>{t("New Enquiry")}</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/enquiry/current")}
          className="bg-[#f8fafc] hover:bg-gray-100 text-dark font-semibold px-3 py-2 rounded border border-brdr text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <Icon name="fa-list" className="text-xs text-muted" />
          <span>{t("Current Enquiries")}</span>
        </Button>
      </div>
      )}
    </div>
  );
};