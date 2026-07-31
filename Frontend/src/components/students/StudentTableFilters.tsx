import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface StudentTableFiltersProps {
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const StudentTableFilters: React.FC<StudentTableFiltersProps> = ({
  selectedClass,
  setSelectedClass,
  searchTerm,
  setSearchTerm,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4 select-none">
      <div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-[#dfe6e9] rounded px-4 py-2 text-dark bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-[13px] min-w-[150px] shadow-sm"
        >
          <option value="">{t("Select Class")}</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
        </select>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="text-[13px] text-muted">{t("Search")}:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-[#dfe6e9] rounded px-3 py-1.5 text-[13px] text-dark focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-white shadow-sm"
          placeholder=""
        />
      </div>
    </div>
  );
};
