import React, { useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string; // e.g., "max-w-md", "max-w-lg"
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-md"
}) => {
  const { t } = useLanguage();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 select-none animate-fadeIn transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg border border-[#e7eaec] w-full shadow-lg overflow-hidden transform scale-100 transition-transform duration-200 ${maxWidthClass}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Modal Header */}
        <div className="bg-sidebar text-white px-6 py-4 flex justify-between items-center select-none">
          <h3 id="modal-title" className="font-semibold text-[15px]">{t(title)}</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="text-white hover:text-teal font-bold bg-transparent border-0 cursor-pointer text-[16px] focus:outline-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
