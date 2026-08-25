/**
 * SidebarMenu — Renders the full sidebar navigation list.
 *
 * Why: Orchestrates rendering of plain links and treeview groups
 *      from the menu data array. Single source of truth for nav order.
 *
 * Props:
 *  - menuItems: array of sidebar entries (link or treeview)
 */

import { useLocation } from "react-router-dom";
import type { SidebarEntry } from "../../constants/LibrariandashboardData";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarTreeView } from "./SidebarTreeView";

interface SidebarMenuProps {
  menuItems: SidebarEntry[];
}

export function SidebarMenu({ menuItems }: SidebarMenuProps) {
  const location = useLocation();

  return (
    <ul className="m-0 list-none p-0">
      {menuItems.map((entry) => {
        if (entry.type === "link") {
          const isActive =
            entry.data.href === location.pathname ||
            (entry.data.label === "Dashboard" && location.pathname === "/dashboard") ||
            (entry.data.href !== "/dashboard" &&
              entry.data.href !== "#" &&
              location.pathname.startsWith(entry.data.href + "/"));

          return (
            <SidebarMenuItem
              key={entry.data.label}
              icon={entry.data.icon}
              label={entry.data.label}
              href={entry.data.href}
              isActive={isActive}
            />
          );
        }

        const activeChild = entry.data.children?.find((child) => {
          if (!child.href || child.href === "#") return false;
          if (child.href === location.pathname) return true;
          if (child.href !== "/dashboard" && location.pathname.startsWith(child.href + "/")) return true;
          return false;
        });

        const isChildActive = !!activeChild;

        return (
          <SidebarTreeView
            key={entry.data.label}
            icon={entry.data.icon}
            label={entry.data.label}
            defaultOpen={entry.data.defaultOpen || isChildActive}
            children={entry.data.children}
            activeLabel={activeChild ? activeChild.label : undefined}
          />
        );
      })}
    </ul>
  );
}
