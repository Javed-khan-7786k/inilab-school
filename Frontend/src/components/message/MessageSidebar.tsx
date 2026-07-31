import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface Folder {
  name: string;
  icon: string;
  active: boolean;
}

interface MessageSidebarProps {
  folders: Folder[];
  onFolderClick: (name: string) => void;
  onComposeClick: () => void;
}

export const MessageSidebar: React.FC<MessageSidebarProps> = ({
  folders,
  onFolderClick,
  onComposeClick,
}) => {
  const { t } = useLanguage();

  return (
    <div className="lg:w-64 flex-shrink-0 select-none">
      {/* Compose Action Button */}
      <button
        type="button"
        onClick={onComposeClick}
        className="w-full bg-[#1abc9c] hover:bg-[#16a085] text-white font-medium py-2 px-4 rounded transition-colors mb-4 border-0 cursor-pointer shadow-sm text-sm"
      >
        {t("Compose")}
      </button>

      {/* Folders List Container */}
      <div className="bg-white rounded-[4px] shadow-sm border border-[#e7eaec] overflow-hidden">
        <div className="bg-sidebar text-white px-4 py-3 font-semibold text-[14px]">
          {t("Folders")}
        </div>
        <nav className="p-2 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              type="button"
              onClick={() => onFolderClick(folder.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors border-0 cursor-pointer text-left ${
                folder.active
                  ? 'bg-gray-100 text-dark font-semibold'
                  : 'bg-transparent text-[#676a6c] hover:bg-[#f8f9fa] hover:text-dark'
              }`}
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
                  d={folder.icon}
                />
              </svg>
              {t(folder.name)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
