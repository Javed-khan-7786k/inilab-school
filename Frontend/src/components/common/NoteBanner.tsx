import React from "react";
import { Icon } from "../ui/Icon";

export interface NoteBannerProps {
  note: string;
  className?: string;
}

export const NoteBanner: React.FC<NoteBannerProps> = ({ note, className = "" }) => {
  return (
    <div
      className={`p-3 bg-[#f0f9ff] border-l-4 border-[#0284c7] rounded text-[12px] text-[#0369a1] flex items-center gap-2 ${className}`}
    >
      <Icon name="fa-info-circle" className="text-[14px] flex-shrink-0" />
      <span>{note}</span>
    </div>
  );
};
