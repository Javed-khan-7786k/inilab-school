import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AttendanceStatsSummaryProps {
  stats: {
    holiday: number;
    weekend: number;
    leave: number;
    present: number;
    lateWithExcuse: number;
    late: number;
    absent: number;
  };
}

export const AttendanceStatsSummary: React.FC<AttendanceStatsSummaryProps> = ({
  stats,
}) => {
  const { t } = useLanguage();

  return (
    <div className="mt-4 text-[13px] text-muted leading-relaxed select-none">
      <span className="font-semibold text-dark mr-1">{t("Total Holiday")}:</span>
      <span className="font-bold text-[#3498db] mr-3">{stats.holiday}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Weekend")}:</span>
      <span className="font-bold text-teal mr-3">{stats.weekend}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Leave")}:</span>
      <span className="font-bold text-[#e67e22] mr-3">{stats.leave}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Present")}:</span>
      <span className="font-bold text-[#2ecc71] mr-3">{stats.present}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Late With Excuse")}:</span>
      <span className="font-bold text-teal mr-3">{stats.lateWithExcuse}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Late")}:</span>
      <span className="font-bold text-badgeorange mr-3">{stats.late}</span>
      
      <span className="font-semibold text-dark mr-1">{t("Total Absent")}:</span>
      <span className="font-bold text-iconred mr-3">{stats.absent}</span>
    </div>
  );
};
