import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AttendanceCalendarGridProps {
  attendance: {
    [month: string]: {
      [day: number]: string;
    };
  };
}

export const AttendanceCalendarGrid: React.FC<AttendanceCalendarGridProps> = ({
  attendance,
}) => {
  const { t } = useLanguage();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getCellColor = (value: string): string => {
    switch (value) {
      case 'P':
        return 'bg-green-500 text-white';
      case 'W':
        return 'bg-teal text-white';
      case 'LE':
        return 'bg-[#2ecc71] text-white';
      case 'H':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-[#3498db] text-white opacity-40';
    }
  };

  return (
    <div className="overflow-x-auto w-full border border-[#dfe6e9] rounded-[3px] shadow-inner">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#f8f9fa] select-none">
            <th className="border-b border-r border-[#dfe6e9] px-1.5 py-1.5 text-center font-semibold text-dark min-w-[1rem]">#</th>
            {days.map((day) => (
              <th key={day} className="border-b border-r border-[#dfe6e9] px-0.5 py-1.5 text-center font-semibold text-dark min-w-[1rem]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {months.map((month) => (
            <tr key={month} className="hover:bg-[#fafafa] transition-colors text-[11px]">
              <td className="border-b border-r border-[#dfe6e9] px-0.5 py-1.5 font-semibold text-dark text-center bg-[#fdfdfd] select-none">
                {t(month)}
              </td >
              {days.map((day) => {
                const value = attendance[month]?.[day] || 'N/A';
                return (
                  <td
                    key={day}
                    className={`border-b border-r border-[#dfe6e9] px-0.5 py-1.5 text-center font-semibold text-[10px] ${getCellColor(value)}`}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
