import React from "react";
import * as Lucide from "lucide-react";

const iconMap: Record<string, React.ComponentType<Lucide.LucideProps>> = {
  "fa-laptop": Lucide.LayoutDashboard,
  "fa-fee": Lucide.HandCoins,
  "fa-list": Lucide.LayoutList,
  "fa-user": Lucide.User,
  "fa-User": Lucide.User,
  "fa-users": Lucide.Users,
  "fa-user-secret": Lucide.UserCheck,
  "fa-user-plus": Lucide.UserPlus,
  "fa-user-circle": Lucide.CircleUser,
  "fa-pencil": Lucide.Pencil,
  "fa-pencil-square-o": Lucide.SquarePen,
  "fa-trash": Lucide.Trash2,
  "fa-book": Lucide.BookOpen,
  "fa-envelope": Lucide.Mail,
  "fa-camera": Lucide.Camera,
  "fa-paper-plane": Lucide.Send,
  "fa-shopping-cart": Lucide.ShoppingCart,
  "fa-tablet": Lucide.Tablet,
  "fa-bullhorn": Lucide.Megaphone,
  "fa-calendar": Lucide.Calendar,
  "fa-calendar-check-o": Lucide.CalendarCheck,
  "fa-calendar-check": Lucide.CalendarCheck,
  "fa-clock-o": Lucide.Clock,
  "fa-flag": Lucide.Flag,
  "fa-file-text": Lucide.FileText,
  "fa-files-o": Lucide.Files,
  "fa-file-pdf-o": Lucide.FileCode,
  "fa-id-card": Lucide.Contact,
  "fa-id-card-o": Lucide.Contact,
  "fa-plus": Lucide.Plus,
  "fa-graduation-cap": Lucide.GraduationCap,
  "fa-globe": Lucide.Globe,
  "fa-bell": Lucide.Bell,
  "fa-phone": Lucide.Phone,
  "fa-lock": Lucide.Lock,
  "fa-key": Lucide.Key,
  "fa-power-off": Lucide.LogOut,
  "fa-caret-down": Lucide.ChevronDown,
  "fa-angle-down": Lucide.ChevronDown,
  "fa-chevron-left": Lucide.ChevronLeft,
  "fa-chevron-right": Lucide.ChevronRight,
  "fa-bars": Lucide.Menu,
  "fa-hand-o-right": Lucide.ChevronRight,
  "fa-handshake-o": Lucide.Handshake,
  "fa-bed": Lucide.Bed,
  "fa-umbrella": Lucide.Umbrella,
  "fa-check-square-o": Lucide.CheckSquare,
  "fa-check": Lucide.Check,
  "fa-check-circle": Lucide.CheckCircle2,
  "fa-exclamation-circle": Lucide.AlertCircle,
  "fa-info-circle": Lucide.Info,
  "fa-upload": Lucide.Upload,
  "fa-times": Lucide.X,
  "fa-bus": Lucide.Bus,
  "fa-heart": Lucide.Heart,
  "fa-save": Lucide.Save,
  "fa-paint-brush": Lucide.Paintbrush,
  "fa-adjust": Lucide.Sliders,
  "fa-sun-o": Lucide.Sun,
  "fa-moon-o": Lucide.Moon,
  "fa-columns": Lucide.Columns2,
  "fa-star": Lucide.Star,
  "fa-cogs": Lucide.Settings,
  "fa-cog": Lucide.Settings,
  "fa-print": Lucide.Printer,
  "fa-search": Lucide.Search,
  "fa-download": Lucide.Download,
  "fa-eye": Lucide.Eye,
  "fa-eye-slash": Lucide.EyeOff,
  "fa-building": Lucide.Building,
  "fa-dollar": Lucide.DollarSign,
  "fa-money": Lucide.Banknote,
  "fa-shield": Lucide.Shield,
  "fa-question-circle": Lucide.HelpCircle,
};

interface IconProps {
  name: string;
  className?: string;
}

function toPascalCase(str: string): string {
  return str
    .replace(/^fa-/, "")
    .replace(/^lucide-/, "")
    .replace(/-o$/, "")
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function Icon({ name, className = "" }: IconProps) {
  // Normalize the icon class name (remove extra spaces and fa prefix if needed)
  const trimmed = name.trim();
  const normalizedKey = trimmed.split(" ").find((part) => part.startsWith("fa-")) || trimmed;

  const pascalName = toPascalCase(normalizedKey);

  const LucideComponent =
    iconMap[normalizedKey] ||
    iconMap[normalizedKey.toLowerCase()] ||
    (Lucide as Record<string, any>)[pascalName] ||
    Lucide.HelpCircle;

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
