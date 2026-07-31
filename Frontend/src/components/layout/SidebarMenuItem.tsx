/**
 * SidebarMenuItem — A single navigation link in the sidebar.
 *
 * Why: Every sidebar nav link (active or default) shares the same markup
 *      pattern. This component handles both states via the `isActive` prop.
 *
 * Props:
 *  - icon    : Font Awesome class (e.g. "fa-laptop")
 *  - label   : display text
 *  - href    : link URL
 *  - isActive: highlights the item as the current page
 */

import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";

interface SidebarMenuItemProps {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarMenuItem({ icon, label, href, isActive = false }: SidebarMenuItemProps) {
  const { t } = useLanguage();
  const activeClasses = "border-l-accent bg-sidebarhover text-white";
  const defaultClasses =
    "border-l-transparent text-sidebartext hover:border-l-accent hover:bg-sidebarhover hover:text-white";

  return (
    <li className={isActive ? "active" : undefined}>
      {href === "#" ? (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`relative block border-l-[3px] px-[15px] py-[12px] text-[14px] ${
            isActive ? activeClasses : defaultClasses
          }`}
        >
          <Icon name={icon} className="mr-[8px] w-[20px]" />
          {t(label)}
        </a>
      ) : (
        <Link
          to={href}
          className={`relative block border-l-[3px] px-[15px] py-[12px] text-[14px] ${
            isActive ? activeClasses : defaultClasses
          }`}
        >
          <Icon name={icon} className="mr-[8px] w-[20px]" />
          {t(label)}
        </Link>
      )}
    </li>
  );
}
