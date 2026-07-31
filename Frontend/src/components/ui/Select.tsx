import React, { useId } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  requiredField?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  error,
  requiredField = false,
  className = "",
  children,
  ...props
}) => {
  const selectId = useId();
  const errorId = useId();

  // Consistent input styling
  const baseSelectClasses = "block w-full px-3 py-2 text-[13px] text-dark bg-white border border-[#dfe6e9] rounded shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorSelectClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-[12px] font-semibold text-muted uppercase tracking-wider ${
            requiredField ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
          }`}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseSelectClasses} ${errorSelectClasses} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children ? (
          children
        ) : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        )}
      </select>
      {error && (
        <div id={errorId} className="text-sm text-red-500 mt-1 select-none">
          {error}
        </div>
      )}
    </div>
  );
};
