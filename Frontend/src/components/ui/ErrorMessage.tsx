import React from "react";
import { Icon } from "./Icon";

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
  onRetry,
}) => {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex flex-col sm:flex-row items-center gap-3 ${className}`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Icon name="fa-exclamation-triangle" className="w-5 h-5 text-red-500 shrink-0" />
        <span className="block sm:inline font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="sm:ml-auto bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-150 ease-in-out cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
};
export default ErrorMessage;
