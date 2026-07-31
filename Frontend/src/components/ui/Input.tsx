import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  requiredField?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  requiredField = false,
  className = "",
  type = "text",
  ...props
}) => {
  const inputId = useId();
  const errorId = useId();

  // Smooth hover/focus transitions and unified styling
  const baseInputClasses = "block w-full px-3 py-2 text-[13px] text-dark bg-white border border-[#dfe6e9] rounded shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorInputClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-[12px] font-semibold text-muted uppercase tracking-wider ${
            requiredField ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`${baseInputClasses} ${errorInputClasses} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <div id={errorId} className="text-sm text-red-500 mt-1 select-none animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
};
