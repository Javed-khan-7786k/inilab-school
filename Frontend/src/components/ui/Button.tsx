import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "export" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  type = "button",
  ...props
}) => {
  // Base classes with smooth transitions and hover micro-animations
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded transition-all duration-150 ease-in-out cursor-pointer focus:outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

  // Variant class mapping
  const variantClasses = {
    primary: "bg-primary hover:bg-orange-600 text-white border-0 shadow-md hover:shadow-lg uppercase tracking-wider",
    secondary: "bg-[#f8f9fa] hover:bg-gray-100 text-dark border border-[#dfe6e9]",
    success: "bg-teal hover:opacity-90 text-white border-0",
    danger: "bg-iconred hover:bg-red-600 text-white border-0",
    warning: "bg-badgeorange hover:bg-orange-600 text-white border-0",
    outline: "border border-teal text-teal hover:bg-teal hover:text-white bg-transparent",
    export: "px-3 py-1.5 text-[12px] font-medium border border-[#dfe6e9] bg-[#f8f9fa] rounded hover:bg-gray-100 text-dark bg-transparent shadow-sm",
    link: "text-secondary hover:text-primary  underline-offset-4 bg-transparent border-0 shadow-none p-0 inline hover:bg-transparent"
  };

  // Size mapping
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] font-medium",
    md: "px-3 py-1.5 text-[12px]",
    lg: "px-4 py-2 text-[14px] rounded-md"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && icon && <span className="mr-1.5 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
