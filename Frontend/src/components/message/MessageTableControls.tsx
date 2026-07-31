import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface MessageTableControlsProps {
  recordsPerPage: number;
  setRecordsPerPage: (val: number) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const MessageTableControls: React.FC<MessageTableControlsProps> = ({
  recordsPerPage,
  setRecordsPerPage,
  searchTerm,
  setSearchTerm,
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
      <div className="flex items-center gap-2">
        <select
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-dark shadow-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-[#676a6c]">{t("records per page")}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-[#676a6c]">{t("Search")}:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-dark shadow-sm"
        />
      </div>
    </div>
  );
};
