/**
 * NavbarUserMenu — User avatar + name + dropdown with Profile, Password, Log out.
 *
 * Why: Isolates the user dropdown trigger and menu from the rest of the navbar.
 *      Manages its own open/close state for the dropdown.
 *
 * Props:
 *  - name     : display name
 *  - avatarUrl: avatar image URL
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { handleImageError } from "../../Utils/image";

interface NavbarUserMenuProps {
  name: string;
  avatarUrl: string;
}

export function NavbarUserMenu({ name, avatarUrl }: NavbarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[50px]  cursor-pointer items-center gap-[5px] border-0 bg-transparent px-[12px] text-[16px] text-muted max-md:px-[5px] max-md:text-[0px]"
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full text-[12px] text-white max-md:text-[12px]">
          <img
            src={avatarUrl}
            onError={handleImageError}
            className="h-full w-full rounded-full border object-cover"
            alt={name}
          />
        </div>
        <span>{name}</span>
        <Icon name="fa-caret-down" className="max-md:text-[12px]" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute text-base rounded-bl-[2px] rounded-br-[4px] overflow-hidden right-0 top-[50px] z-[200] min-w-[160px] w-[250px] bg-white shadow-[0_6px_12px_rgba(0,0,0,.175)]">

          <div className="flex  w-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                const userId = sessionStorage.getItem("userId") || "1";
                navigate(`/dashboard/view/user/${userId}`);
              }}
              className="flex w-full items-center gap-[10px] px-[20px] py-[8px] text-[13px] text-muted hover:bg-[#f5f5f5] hover:text-dark border-0 bg-transparent text-left cursor-pointer"
            >
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center gap-[10px]">

                  <Icon name="fa-user" className="w-[16px]" />
                  <div className="flex items-center justify-center">
                    {t("Profile")}
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-[10px] px-[20px] py-[8px] text-[13px] text-muted hover:bg-[#f5f5f5] hover:text-dark border-0 bg-transparent text-left cursor-pointer"
            >
              <div className="flex items-center justify-center  w-full">
                <div className="flex flex-col items-center justify-center gap-[10px]">

                  <Icon name="fa-lock" className="w-[16px]" />
                  <div className="flex items-center justify-center">
                    {t("Password")}
                  </div>
                </div>
              </div>
            </button>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-[10px] border-0 bg-[#366873] px-[20px] py-[8px] text-[13px] text-white hover:bg-[#366865]"
          >
              <div className="flex items-center justify-center  w-full">
                <div className="flex flex-col items-center justify-center gap-[10px]">

                  <Icon name="fa-power-off" className="w-[16px]" />
                  <div className="flex items-center justify-center">
                    {t("Log out")}
                  </div>
                </div>
              </div>
          </button>
        </div>
            // <div className="flex items-center justify-center"><Icon name="fa-power-off" className="w-[16px]" /></div>
      )}
    </div>
  );
}
