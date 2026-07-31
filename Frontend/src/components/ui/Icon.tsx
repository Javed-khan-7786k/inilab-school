import React from "react";
import * as Lucide from "lucide-react";

const iconMap: Record<string, React.ComponentType<Lucide.LucideProps>> = {
  "fa-laptop": Lucide.LayoutDashboard,
  "fa-user": Lucide.User,
  "fa-pencil":Lucide.Pencil,
  "fa-trash":Lucide.Trash2,
  "fa-book": Lucide.BookOpen,
  "fa-user-secret": Lucide.UserCheck,
  "fa-envelope": Lucide.Mail,
  "fa-camera": Lucide.Camera,
  "fa-paper-plane": Lucide.Send,
  "fa-shopping-cart": Lucide.ShoppingCart,
  "fa-tablet": Lucide.Tablet,
  "fa-bullhorn": Lucide.Megaphone,
  "fa-calendar": Lucide.Calendar,
  "fa-calendar-check-o": Lucide.CalendarCheck,
  "fa-flag": Lucide.Flag,
  "fa-file-text": Lucide.FileText,
  "fa-id-card": Lucide.Contact,
  "fa-user-plus": Lucide.UserPlus,
  "fa-plus": Lucide.Plus,
  "fa-graduation-cap": Lucide.GraduationCap,
  "fa-globe": Lucide.Globe,
  "fa-bell": Lucide.Bell,
  "fa-phone": Lucide.Phone,
  "fa-lock": Lucide.Lock,
  "fa-User": Lucide.SquareUser,
  "fa-power-off": Lucide.LogOut,
  "fa-caret-down": Lucide.ChevronDown,
  "fa-bars": Lucide.Menu,
  "fa-hand-o-right": Lucide.ChevronRight,
  "fa-bed": Lucide.Bed,
  "fa-umbrella": Lucide.Umbrella,
  "fa-angle-down": Lucide.ChevronDown,
  "fa-chevron-left": Lucide.ChevronLeft,
  "fa-chevron-right": Lucide.ChevronRight,
  "fa-check-square-o": Lucide.CheckSquare,
  "fa-check": Lucide.Check,
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  // Normalize the icon class name (remove extra spaces and fa prefix if needed)
  const normalizedKey = name.trim().split(" ").find((part) => part.startsWith("fa-")) || name.trim();

  const LucideComponent = iconMap[normalizedKey] || Lucide.HelpCircle;

  // Extract size from tailwind class if possible to keep layout matching
  let size = 16; // default size

  const wMatch = className.match(/w-\[(\d+)px\]/);
  const sizeMatch = className.match(/text-\[(\d+)px\]/);

  if (wMatch) {
    size = parseInt(wMatch[1], 10);
  } else if (sizeMatch) {
    size = parseInt(sizeMatch[1], 10);
  } else if (className.includes("text-[10px]")) {
    size = 10;
  } else if (className.includes("text-[12px]")) {
    size = 12;
  } else if (className.includes("text-[14px]")) {
    size = 14;
  } else if (className.includes("text-[18px]")) {
    size = 18;
  } else if (className.includes("text-[20px]")) {
    size = 20;
  } else if (className.includes("text-[50px]")) {
    size = 50;
  }

  // Remove the text size classes to avoid text size styling interfering with SVG sizing in CSS
  const cleanClassName = className
    .replace(/text-\[(\d+)px\]/g, "")
    .replace(/w-\[(\d+)px\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Lucide React renders an SVG; stroke is used for coloring, which inherits from currentColor (Tailwind text-color classes)
  return <LucideComponent className={`inline-block ${cleanClassName}`} size={size} />;
}
