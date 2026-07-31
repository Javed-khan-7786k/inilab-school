import type { SidebarEntry } from "../../constants/LibrariandashboardData";
import { SidebarUserPanel } from "./SidebarUserPanel";
import { SidebarMenu } from "./SidebarMenu";

interface SidebarProps {
  isCollapsed: boolean;
  isOpen: boolean;
  userName: string;
  userRole: string;
  userAvatarUrl: string;
  menuItems: SidebarEntry[];
}

export function Sidebar({
  isCollapsed,
  isOpen,
  userName,
  userRole,
  userAvatarUrl,
  menuItems,
}: SidebarProps) {
  const collapseClasses = isCollapsed
    ? "w-0 overflow-hidden [&>*]:invisible"
    : "w-[230px]";

  const mobileClasses = isOpen
    ? "max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:z-[95] max-md:w-[230px] max-md:overflow-y-auto max-md:[&>*]:visible max-md:shadow-lg"
    : "max-md:w-0 max-md:overflow-hidden max-md:[&>*]:invisible";

  return (
    <aside
      className={`shrink-0 overflow-y-auto bg-sidebar pt-[50px] text-sidebartext transition-[width,margin-left] duration-[250ms] ease-in-out [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${collapseClasses} ${mobileClasses}`}
    >
      <SidebarUserPanel name={userName} role={userRole} avatarUrl={userAvatarUrl} />
      <SidebarMenu menuItems={menuItems} />
    </aside>
  );
}
