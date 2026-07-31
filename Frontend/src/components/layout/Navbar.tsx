/**
 * Navbar — Top navigation bar with brand, hamburger toggle, icons, and user menu.
 */

import { NavbarIconLink } from "../ui/NavbarIconLink";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { LanguageDropdown } from "./LanguageDropdown";
import { Icon } from "../ui/Icon";

interface NavbarProps {
  onToggleSidebar: () => void;
  userName: string;
  userAvatarUrl: string;
  userRole?: string;
}

export function Navbar({ onToggleSidebar, userName, userAvatarUrl }: NavbarProps) {
  return (
    <div className="sticky top-0 z-[100] flex h-[50px] flex-1 items-center bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      {/* Brand Header Box */}
      <div className="fixed left-0 top-0 z-[120] flex h-[50px] w-[180px] sm:w-[230px] items-center border-b border-brdr bg-white pl-[15px] text-[16px] sm:text-[18px] font-semibold text-dark select-none truncate">
        KanakLabs School
      </div>

      {/* Hamburger Sidebar Toggle Button (Positioned cleanly right after Brand box without overlap) */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className="fixed left-[180px] sm:left-[230px] top-0 z-[130] flex h-[50px] w-[45px] items-center justify-center cursor-pointer border-0 bg-transparent text-dark focus:outline-none active:scale-95 transition-all select-none hover:text-teal"
        title="Toggle Menu"
      >
        <Icon name="fa-bars" className="text-[18px]" />
      </button>

      {/* Right Navbar Icons & Menus */}
      <div className="ml-auto flex items-center pr-[15px] max-md:pr-[5px]">
        <NavbarIconLink icon="fa-globe" href="#" hiddenOnMobile />
        <NavbarIconLink
          icon="fa-bell"
          href="/dashboard/announcement/notice"
          badgeCount={18}
          badgeColor="bg-badgered"
          hiddenOnMobile
        />

        <div className="max-md:hidden">
          <LanguageDropdown />
        </div>
        <NavbarUserMenu name={userName} avatarUrl={userAvatarUrl} />
      </div>
    </div>
  );
}
