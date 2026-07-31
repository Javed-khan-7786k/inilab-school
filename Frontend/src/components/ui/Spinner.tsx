import React from "react";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-t-transparent border-red-500 rounded-full animate-spin`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
export default Spinner;
