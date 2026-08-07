import React from "react";

export interface FormRowProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  alignTop?: boolean;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  label,
  required = false,
  error,
  children,
  alignTop = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row ${
        alignTop ? "sm:items-start" : "sm:items-center"
      } gap-2 sm:gap-4 ${className}`}
    >
      <label
        className={`sm:w-1/4 text-[13px] font-semibold text-[#444] ${
          alignTop ? "sm:pt-2" : ""
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="sm:w-3/4">
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};
