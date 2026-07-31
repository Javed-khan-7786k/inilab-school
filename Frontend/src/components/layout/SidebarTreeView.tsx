/**
 * SidebarTreeView — Collapsible sidebar section with child links.
 *
 * Why: Library, Announcement, and Report sections all share the same
 *      expand/collapse pattern. This component encapsulates that behavior.
 *
 * Props:
 *  - icon       : Font Awesome class for the parent link
 *  - label      : text for the parent link
 *  - children   : array of child menu items
 *  - defaultOpen: whether to render expanded initially
 */

import { useState } from "react";
import type { SidebarMenuItemData } from "../../constants/LibrariandashboardData";
import { Icon } from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";

interface SidebarTreeViewProps {
  icon: string;
  label: string;
  children: SidebarMenuItemData[];
  defaultOpen?: boolean;
  activeLabel?: string;
  onChildClick?: (label: string) => void;
}

export function SidebarTreeView({
  icon,
  label,
  children,
  defaultOpen = false,
  activeLabel,
  onChildClick,
}: SidebarTreeViewProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { t } = useLanguage();

  return (
    <li className={`treeview group/tv${isOpen ? " open" : ""}`}>
      <a
        href="#"
        className="relative block border-l-[3px] border-l-transparent px-[15px] py-[12px] text-[14px] text-sidebartext hover:border-l-accent hover:bg-sidebarhover hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
      >
        <Icon name={icon} className="mr-[8px] w-[20px]" />
        {t(label)}
        <Icon
          name="fa-angle-down"
          className={`float-right mt-[3px] transition-transform duration-300${
            isOpen ? " rotate-180" : ""
          }`}
        />
      </a>
      <ul
        className={`m-0 list-none bg-treeview p-0${isOpen ? " block" : " hidden"}`}
      >
        {children.map((child) => {
          const isChildActive = activeLabel === child.label;
          return (
            <li key={child.label}>
              {child.href === "#" ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onChildClick) {
                      onChildClick(child.label);
                    }
                  }}
                  className={`block px-[15px] py-[8px] pl-[40px] text-[13px] hover:text-white transition-colors duration-150 ${
                    isChildActive ? "text-white bg-sidebarhover font-medium" : "text-treetext"
                  }`}
                >
                  <Icon name={child.icon} className="mr-[8px]" />
                  {t(child.label)}
                </a>
              ) : (
                <Link
                  to={child.href}
                  className={`block px-[15px] py-[8px] pl-[40px] text-[13px] hover:text-white transition-colors duration-150 ${
                    isChildActive ? "text-white bg-sidebarhover font-medium" : "text-treetext"
                  }`}
                >
                  <Icon name={child.icon} className="mr-[8px]" />
                  {t(child.label)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}
