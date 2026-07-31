import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface StudentTableFooterProps {
  totalCount: number;
  filteredCount: number;
}

export const StudentTableFooter: React.FC<StudentTableFooterProps> = ({
  totalCount,
  filteredCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="px-4 py-3 border-t border-[#e7eaec] select-none">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[13px] text-muted">
          {t("Showing")} {filteredCount > 0 ? 1 : 0} {t("to")} {filteredCount} {t("of")} {totalCount} {t("entries")}
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            disabled
            className="px-4 py-2 text-[12px] font-medium border border-[#dfe6e9] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer text-dark bg-transparent"
          >
            {t("Previous")}
          </button>
          <button
            type="button"
            disabled
            className="px-4 py-2 text-[12px] font-medium border border-[#dfe6e9] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer text-dark bg-transparent"
          >
            {t("Next")}
          </button>
        </div>
      </div>
    </div>
  );
};
