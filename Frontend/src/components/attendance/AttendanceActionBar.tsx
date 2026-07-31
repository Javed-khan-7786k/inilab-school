import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../ui/Icon';

interface AttendanceActionBarProps {
  breadcrumbTitle: string;
  onPrint: () => void;
  onMail: () => void;
}

export const AttendanceActionBar: React.FC<AttendanceActionBarProps> = ({
  breadcrumbTitle,
  onPrint,
  onMail,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#e7eaec] rounded-[4px] shadow-sm select-none">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-action hover:opacity-90 text-white rounded transition-colors text-[13px] font-medium border-0 cursor-pointer shadow-sm"
        >
          <Icon name="fa-print" className="w-4 h-4" />
          {t("Print")}
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-action hover:opacity-90 text-white rounded transition-colors text-[13px] font-medium border-0 cursor-pointer shadow-sm"
        >
          <Icon name="fa-file-pdf-o" className="w-4 h-4" />
          {t("PDF Preview")}
        </button>
        <button
          type="button"
          onClick={onMail}
          className="flex items-center gap-2 px-4 py-2 bg-action hover:opacity-90 text-white rounded transition-colors text-[13px] font-medium border-0 cursor-pointer shadow-sm"
        >
          <Icon name="fa-envelope" className="w-4 h-4" />
          {t("Send Pdf to Mail")}
        </button>
      </div>

      <nav className="text-[13px] text-muted flex items-center space-x-1">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer bg-transparent border-0 text-muted"
        >
          <Icon name="fa-laptop" className="w-4 h-4 text-muted" />
          <span>{t("Dashboard")}</span>
        </button>
        <span>/</span>
        <span>{breadcrumbTitle}</span>
        <span>/</span>
        <span className="text-teal font-medium">{t("View")}</span>
      </nav>
    </div>
  );
};
