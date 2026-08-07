import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { Message } from '../../pages';

interface MessageTableContentProps {
  messages: Message[];
  recordsPerPage: number;
  currentPage: number;
  totalCount: number;
  filteredCount: number;
  onPageChange: (page: number) => void;
  onRowSelect?: (id: number) => void;
}

export const MessageTableContent: React.FC<MessageTableContentProps> = ({
  messages,
  recordsPerPage,
  currentPage,
  totalCount,
  filteredCount,
  onPageChange,
}) => {
  const { t } = useLanguage();

  const totalPages = Math.ceil(filteredCount / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;

  return (
    <div className="flex-1 flex flex-col">
      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#f8f9fa] border-b border-gray-200 select-none">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Status")}</span>
                  <svg className="w-3 h-3 text-[#1abc9c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Name")}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Subject")}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Attach")}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Time")}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1">
                  <span>{t("Reply")}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f0f0f0]">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                  {t("No data available in table")}
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.id}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.status}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c] font-medium">{message.name}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.subject}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.attach || '-'}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.time}</td>
                  <td className="px-4 py-3 text-sm text-[#676a6c]">{message.reply || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-gray-200 mt-auto select-none">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[13px] text-muted">
            {t("Showing")} {filteredCount > 0 ? startIndex + 1 : 0} {t("to")}{' '}
            {Math.min(startIndex + recordsPerPage, filteredCount)} {t("of")} {totalCount} {t("entries")}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="px-4 py-2 text-[12px] font-medium border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer text-dark bg-transparent"
            >
              {t("Previous")}
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className="px-4 py-2 text-[12px] font-medium border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer text-dark bg-transparent"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
