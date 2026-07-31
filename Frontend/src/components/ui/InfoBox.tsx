/**
 * InfoBox — Interactive colored stat card showing a metric.
 * Clickable button that navigates directly to the associated module page.
 */

import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { useLanguage } from "../../context/LanguageContext";

interface InfoBoxProps {
  value: number;
  label: string;
  icon: string;
  bgColor: string;
  onClick?: () => void;
  href?: string;
}

export function InfoBox({ value, label, icon, bgColor, onClick, href }: InfoBoxProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getRouteForLabel = (lbl: string): string | null => {
    const lower = lbl.toLowerCase().trim();
    if (lower.includes("student")) return "/dashboard/student";
    if (lower.includes("teacher")) return "/dashboard/teacher";
    if (lower.includes("parent")) return "/dashboard/parents";
    if (lower.includes("visitor")) return "/dashboard/visitor";
    if (lower.includes("user") || lower.includes("member")) return "/dashboard/user";
    if (lower.includes("notice")) return "/dashboard/announcement/notice";
    if (lower.includes("event")) return "/dashboard/announcement/event";
    if (lower.includes("holiday")) return "/dashboard/announcement/holiday";
    if (lower.includes("enquir")) return "/dashboard/enquiry/current";
    if (lower.includes("leave")) return "/dashboard/leave-apply";
    if (lower.includes("message")) return "/dashboard/message";
    return null;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const targetPath = href || getRouteForLabel(label);
    if (targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${t("Go to")} ${t(label)}`}
      className={`z-10 flex min-w-[200px] flex-1 items-center justify-between rounded-[4px] ${bgColor} p-[20px] text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-0 text-left hover:scale-[1.02] active:scale-[0.98] focus:outline-none`}
    >
      <div>
        <div className="text-[38px] font-bold leading-none select-none">{value}</div>
        <div className="mt-[6px] text-[15px] font-medium tracking-wide flex items-center gap-1">
          <span>{t(label)}</span>
          <Icon name="fa-arrow-circle-right" className="text-xs opacity-75 hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <Icon name={icon} className="text-[50px] opacity-45 hover:opacity-75 transition-opacity" />
    </button>
  );
}
