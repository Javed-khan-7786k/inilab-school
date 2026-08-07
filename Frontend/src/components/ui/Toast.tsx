import React from "react";
import { Icon } from "./Icon";

export interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success" }) => {
  return (
    <div
      className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
        type === "success"
          ? "bg-[#1abc9c] shadow-[#1abc9c]/20"
          : "bg-red-500 shadow-red-500/20"
      }`}
    >
      <Icon
        name={type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}
        className="text-[16px]"
      />
      <span>{message}</span>
    </div>
  );
};
