/**
 * SidebarUserPanel — Avatar, name, and role display at the top of the sidebar.
 *
 * Why: Encapsulates the user identity area in the sidebar.
 *
 * Props:
 *  - name     : user's display name
 *  - role     : user's role (e.g. "Librarian")
 *  - avatarUrl: URL for the user's avatar image
 */

import { useLanguage } from "../../context/LanguageContext";
import { handleImageError } from "../../Utils/image";

interface SidebarUserPanelProps {
  name: string;
  role: string;
  avatarUrl: string;
}

export function SidebarUserPanel({ name, role, avatarUrl }: SidebarUserPanelProps) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center border-b border-[#222d32] p-[12px] bg-[#1a2226]">
      <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-[#374850] bg-teal">
        <img src={avatarUrl} onError={handleImageError} className="h-full w-full object-cover" alt="User" />
      </div>
      <div className="pl-[12px] min-w-0">
        <p className="m-0 text-[14px] font-semibold text-white truncate leading-tight">{name}</p>
        <div className="flex items-center text-[11px] text-[#b8c7ce] mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00a65a] mr-1.5 shrink-0"></span>
          <span className="truncate">{t(role)}</span>
        </div>
      </div>
    </div>
  );
}
