import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface StudentTableToolbarProps {
  onCopy: () => void;
  onExport: (format: string) => void;
}

export const StudentTableToolbar: React.FC<StudentTableToolbarProps> = ({
  onCopy,
  onExport,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 select-none">
      <button
        type="button"
        onClick={onCopy}
        className="px-3 py-1.5 text-[12px] font-medium border border-[#dfe6e9] bg-[#f8f9fa] rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
      >
        {t("Copy")}
      </button>
      <button
        type="button"
        onClick={() => onExport('excel')}
        className="px-3 py-1.5 text-[12px] font-medium border border-[#dfe6e9] bg-[#f8f9fa] rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
      >
        {t("Excel")}
      </button>
      <button
        type="button"
        onClick={() => onExport('csv')}
        className="px-3 py-1.5 text-[12px] font-medium border border-[#dfe6e9] bg-[#f8f9fa] rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
      >
        {t("CSV")}
      </button>
      <button
        type="button"
        onClick={() => onExport('pdf')}
        className="px-3 py-1.5 text-[12px] font-medium border border-[#dfe6e9] bg-[#f8f9fa] rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
      >
        {t("PDF")}
      </button>
    </div>
  );
};
