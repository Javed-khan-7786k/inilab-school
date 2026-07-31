/**
 * Calendar — Full month calendar with toolbar and day grid.
 *
 * Why: The calendar is a self-contained widget with its own toolbar
 *      (navigation, view buttons) and day grid table.
 *
 * Props:
 *  - month       : month name (e.g. "July")
 *  - year        : year number
 *  - dayNames    : array of day header labels (Sun, Mon, ...)
 *  - weeks       : 2D array of CalendarDay objects
 */

import type { CalendarDay } from "../../constants/LibrariandashboardData";
import { Icon } from "./Icon";
import { useLanguage } from "../../context/LanguageContext";

interface CalendarProps {
  month: string;
  year: number;
  dayNames: string[];
  weeks: CalendarDay[][];
}

export function Calendar({ month, year, dayNames, weeks }: CalendarProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-[15px] rounded-[3px] bg-white p-[15px] shadow-[0_1px_1px_rgba(0,0,0,.1)]">
      {/* Toolbar */}
      <div className="mb-[10px] flex items-center justify-between">
        {/* Left: Nav */}
        <div>
          <button className="mr-[5px] inline-flex h-[24px] w-[24px] items-center justify-center rounded-full border-none bg-calblue text-[10px] text-white transition-colors hover:bg-calblue2">
            <Icon name="fa-chevron-left" className="text-[10px]" />
          </button>
          <button className="mr-[5px] inline-flex h-[24px] w-[24px] items-center justify-center rounded-full border-none bg-calblue text-[10px] text-white transition-colors hover:bg-calblue2">
            <Icon name="fa-chevron-right" className="text-[10px]" />
          </button>
          <button className="mr-[2px] rounded-[3px] border border-calbrdr bg-calbg px-[10px] py-[5px] text-[12px] text-dark">
            {t("today")}
          </button>
        </div>

        {/* Center: Title */}
        <h2 className="m-0 text-[24px] font-light text-muted">
          {t(month)} {year}
        </h2>

        {/* Right: View Buttons */}
        <div>
          <button className="mr-[2px] rounded-[3px] border border-calblue bg-calblue px-[10px] py-[5px] text-[12px] text-white">
            {t("month")}
          </button>
          <button className="mr-[2px] rounded-[3px] border border-calbrdr bg-calbg px-[10px] py-[5px] text-[12px] text-dark">
            {t("week")}
          </button>
          <button className="mr-[2px] rounded-[3px] border border-calbrdr bg-calbg px-[10px] py-[5px] text-[12px] text-dark">
            {t("day")}
          </button>
          <button className="mr-[2px] rounded-[3px] border border-calbrdr bg-calbg px-[10px] py-[5px] text-[12px] text-dark">
            {t("list")}
          </button>
        </div>
      </div>

      {/* Day Grid */}
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {dayNames.map((day) => (
              <th
                key={day}
                className="border border-calbrdr bg-calbg px-[6px] py-[8px] text-center text-[12px] font-medium text-dark"
              >
                {t(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((cell, dayIndex) => {
                let cellClasses =
                  "h-[90px] border border-calbrdr px-[6px] py-[4px] text-right align-top text-[12px]";

                if (cell.isOtherMonth) {
                  cellClasses += " bg-[#f8f9fa] text-othermonth";
                } else if (cell.isToday) {
                  cellClasses += " bg-today font-bold text-dark";
                } else {
                  cellClasses += " text-muted";
                }

                return (
                  <td key={dayIndex} className={cellClasses}>
                    {cell.day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
