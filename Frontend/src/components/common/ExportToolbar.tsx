import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportPdfWithImages,
} from "../../Utils/exportService";

export interface ExportToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport?: (type: "copy" | "excel" | "csv" | "pdf") => void;
  data?: any[];
  columns?: ExportColumn[];
  filename?: string;
  placeholder?: string;
  className?: string;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onExport,
  data = [],
  columns = [],
  filename = "export",
  placeholder,
  className = "",
}) => {
  const { t } = useLanguage();

  const handleExport = async (type: "copy" | "excel" | "csv" | "pdf") => {
    if (onExport) {
      onExport(type);
      return;
    }

    if (type === "copy") {
      handleCopyToClipboard(data, columns);
    } else if (type === "csv") {
      handleExportCsv(data, columns, filename);
    } else if (type === "excel") {
      try {
        await exportExcelWithImages(data, columns, filename);
      } catch {
        handleExportCsv(data, columns, filename);
      }
    } else if (type === "pdf") {
      try {
        await exportPdfWithImages(data, columns, filename);
      } catch {
        handleExportCsv(data, columns, filename);
      }
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Export Action Buttons */}
      <div className="flex items-center border border-[#d2d6de] rounded overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => handleExport("copy")}
          className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={() => handleExport("excel")}
          className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
        >
          Excel
        </button>
        <button
          type="button"
          onClick={() => handleExport("csv")}
          className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] border-r border-[#d2d6de] text-[#444] font-medium transition-colors cursor-pointer"
        >
          CSV
        </button>
        <button
          type="button"
          onClick={() => handleExport("pdf")}
          className="px-2.5 py-1.5 bg-[#f4f4f4] hover:bg-[#e7e7e7] text-[#444] font-medium transition-colors cursor-pointer"
        >
          PDF
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || `${t("Search")}:`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-[3px] border border-[#d2d6de] px-3 py-1 text-[12px] focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
};
