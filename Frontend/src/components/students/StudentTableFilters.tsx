import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';

interface StudentTableFiltersProps {
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  classList?: string[];
}

export const StudentTableFilters: React.FC<StudentTableFiltersProps> = ({
  selectedClass,
  setSelectedClass,
  searchTerm,
  setSearchTerm,
  classList,
}) => {
  const { t } = useLanguage();
  const [classes, setClasses] = useState<string[]>(classList || []);

  useEffect(() => {
    if (classList && classList.length > 0) {
      setClasses(classList);
      return;
    }

    let isMounted = true;
    dataService.getClasses().then((dbClasses) => {
      if (isMounted && Array.isArray(dbClasses)) {
        const classNames = dbClasses.map((c) => c.name.trim()).filter(Boolean);
        setClasses(classNames);
      }
    }).catch((err) => {
      console.warn('Failed to load classes for StudentTableFilters:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [classList]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4 select-none">
      <div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-[#dfe6e9] rounded px-4 py-2 text-dark bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-[13px] min-w-[150px] shadow-sm cursor-pointer"
        >
          <option value="">{t("Select Class")}</option>
          {classes.map((clsName) => (
            <option key={clsName} value={clsName}>
              {clsName}
            </option>
          ))}
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
