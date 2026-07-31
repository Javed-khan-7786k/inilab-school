/**
 * PanelCard — Generic white panel with a heading and content slot.
 *
 * Why: The Notice section (and potentially other dashboard sections)
 *      uses this pattern: a white card with a bordered heading + body.
 *
 * Props:
 *  - title   : heading text
 *  - children: content to render inside the card body
 */

import type { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  children: ReactNode;
}

export function PanelCard({ title, children }: PanelCardProps) {
  return (
    <div className="rounded-[3px] bg-white shadow-[0_1px_1px_rgba(0,0,0,.1)]">
      <div className="border-b border-[#f0f0f0] px-[15px] py-[12px] text-[14px] font-medium text-dark">
        {title}
      </div>
      {children}
    </div>
  );
}
