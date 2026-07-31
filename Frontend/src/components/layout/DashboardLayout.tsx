import { useState, useCallback, useEffect, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { authService } from "../../services/authService";
import { navigationApi } from "../../services/api/navigationApi";
import { getPhotoUrl } from "../../Utils/image";
import type { SidebarEntry } from "../../constants/LibrariandashboardData";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<SidebarEntry[]>([]);

  const handleToggleSidebar = useCallback(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
      setIsSidebarCollapsed(false);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
      setIsSidebarOpen(false);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const userRole = authService.getUserRole() || "Librarian";
  const userName = authService.getUserName() || "Guest";
  const userAvatarUrl = getPhotoUrl(authService.getUserPhoto());

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const items = await navigationApi.getNavigation(userRole);
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to load navigation items:", err);
      }
    };

    fetchNavigation();
  }, [userRole]);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-bodybg font-sans text-[13px] text-dark [&_a]:no-underline">
      {/* Mobile Drawer Backdrop (Clean overlay without blur artifacts) */}
      {isSidebarOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-[85] bg-black/40 md:hidden transition-opacity cursor-pointer"
        />
      )}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        userName={userName}
        userRole={userRole}
        userAvatarUrl={userAvatarUrl}
        menuItems={menuItems}
      />

      <div className="h-screen min-w-0 flex-1 overflow-y-auto bg-mainbg">
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          userRole={userRole}
        />

        <div className="p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-hidden">{children}</div>

        <Footer />
      </div>
    </div>
  );
}
