import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { LANGUAGES } from "../../config/languages";
import { Icon } from "../ui/Icon";

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, changeLanguage, currentLanguage, t } = useLanguage();

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button mimicking the design of the original Flag button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[50px] cursor-pointer items-center px-[12px] text-[16px] text-muted max-md:px-[5px] focus:outline-none"
        aria-label="Select language"
      >
        <img
          className="w-[22px] h-[14px] object-cover border border-[#d5d5d5] rounded-[1px] align-middle"
          src={currentLanguage.flagUrl}
          alt={currentLanguage.name}
        />
        {/* Preserving the badge count showing 15 for aesthetics */}
        <span className="absolute right-[2px] top-[8px] flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-badgeorange px-[3px] text-[9px] font-bold leading-[14px] text-white">
          15
        </span>
      </button>

      {/* Dropdown Popup Panel matching user layout design exactly */}
      {isOpen && (
        <div className="absolute right-0 top-[50px] z-[200] w-[200px] rounded-[3px] border border-[#e7eaec] bg-white text-left shadow-[0_6px_12px_rgba(0,0,0,.175)]">
          {/* Header */}
          <div className="border-b border-[#e7eaec] px-[15px] py-[10px] text-[14px] font-semibold text-dark select-none">
            {t("Language")}
          </div>

          {/* List of Languages */}
          <div className="py-[4px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-[12px] px-[15px] py-[9px] hover:bg-[#f5f5f5] text-left border-0 bg-transparent transition-colors duration-150"
              >
                <img
                  src={lang.flagUrl}
                  alt={lang.name}
                  className="w-[22px] h-[14px] object-cover border border-[#e2e2e2] rounded-[1px] align-middle"
                />
                <span className="flex-1 text-[13px] text-dark font-normal">
                  {t(lang.name)}
                </span>
                {language === lang.code && (
                  <Icon name="fa-check" className="text-dark text-[11px]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
