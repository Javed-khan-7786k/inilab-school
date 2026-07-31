import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const StudentTableHeader: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="bg-sidebar text-white py-3 px-6 rounded-t-[4px] shadow-sm select-none">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h1 className="text-lg font-semibold">{t("Student")}</h1>
        </div>
        <nav className="flex items-center space-x-2 text-sm text-sidebartext">
          <button 
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{t("Dashboard")}</span>
          </button>
          <span className="text-[#8aa4af]">/</span>
          <span className="text-teal font-medium">{t("Student")}</span>
        </nav>
      </div>
    </header>
  );
};
