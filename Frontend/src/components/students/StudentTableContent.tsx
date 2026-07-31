import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../ui/Icon';

import type { Student } from '../../types';

interface StudentTableContentProps {
  students: Student[];
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

type SortField = 'id' | 'name' | 'roll' | 'email';
type SortOrder = 'asc' | 'desc';

export const StudentTableContent: React.FC<StudentTableContentProps> = ({
  students,
  onDelete,
  onEdit,
}) => {
  const { t } = useLanguage();
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'string') {
        const strA = valA.toLowerCase();
        const strB = (valB as string).toLowerCase();
        return sortOrder === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      } else {
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
  }, [students, sortField, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <Icon name="fa-caret-down" className="text-gray-300 ml-1 text-[10px]" />;
    }
    return sortOrder === 'asc' ? (
      <Icon name="fa-caret-down" className="text-teal ml-1 text-[10px] rotate-180 transition-transform duration-200" />
    ) : (
      <Icon name="fa-caret-down" className="text-teal ml-1 text-[10px] transition-transform duration-200" />
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <thead className="bg-[#f8f9fa] border-b border-[#e7eaec]">
          <tr className="select-none">
            <th 
              onClick={() => handleSort('id')}
              className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors w-[60px]"
            >
              <div className="flex items-center">
                <span>#</span>
                {renderSortIcon('id')}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-[80px]">
              {t("Photo")}
            </th>
            <th 
              onClick={() => handleSort('name')}
              className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            >
              <div className="flex items-center">
                <span>{t("Name")}</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th 
              onClick={() => handleSort('roll')}
              className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors w-[120px]"
            >
              <div className="flex items-center">
                <span>{t("Roll")}</span>
                {renderSortIcon('roll')}
              </div>
            </th>
            <th 
              onClick={() => handleSort('email')}
              className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            >
              <div className="flex items-center">
                <span>{t("Email")}</span>
                {renderSortIcon('email')}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-[120px]">
              {t("Action")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#f0f0f0]">
          {sortedStudents.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]"
              >
                {t("No data available in table")}
              </td>
            </tr>
          ) : (
            sortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-dark">
                  {student.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-[36px] h-[36px] rounded-full object-cover border border-[#e1e1e1] shadow-sm"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-dark">
                  {student.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted">
                  {student.roll}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted">
                  {student.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => onEdit(student.id)}
                      className="px-2 py-1 text-[11px] font-medium border border-teal text-teal hover:bg-teal hover:text-white rounded transition-colors duration-150 cursor-pointer bg-transparent"
                    >
                      {t("Edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(student.id)}
                      className="px-2 py-1 text-[11px] font-medium border border-iconred text-iconred hover:bg-iconred hover:text-white rounded transition-colors duration-150 cursor-pointer bg-transparent"
                    >
                      {t("Delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
