// ─── Types ───────────────────────────────────────────────────────────

export interface SidebarMenuItemData {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface SidebarTreeViewData {
  icon: string;
  label: string;
  defaultOpen?: boolean;
  children: SidebarMenuItemData[];
}

export type SidebarEntry = 
  | { type: "link"; data: SidebarMenuItemData }
  | { type: "treeview"; data: SidebarTreeViewData };

export interface InfoBoxData {
  value: number;
  label: string;
  icon: string;
  bgColor: string;
}

export interface ProfileDetailData {
  icon: string;
  label: string;
  value: string;
}

export interface NoticeData {
  id: string | number;
  title: string;
  description: string;
  actionHref?: string;
  date?: string;
  notice?: string;
}

export interface CalendarDay {
  day: number;
  isOtherMonth?: boolean;
  isToday?: boolean;
}

// ─── Sidebar Menu ────────────────────────────────────────────────────

export const sidebarMenuItems: SidebarEntry[] = [
  { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
  { type: "link", data: { icon: "fa-user", label: "Teacher", href: "/dashboard/teacher" } },
  { type: "link", data: { icon: "fa-book", label: "Subject", href: "#" } },
  { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
  { type: "link", data: { icon: "fa-paper-plane", label: "Leave Apply", href: "/dashboard/leave-apply" } },
  {
    type: "treeview",
    data: {
      icon: "fa-book",
      label: "Library",
      defaultOpen: true,
      children: [
        { icon: "fa-user", label: "Member", href: "#" },
        { icon: "fa-book", label: "Books", href: "#" },
        { icon: "fa-shopping-cart", label: "Issue", href: "#" },
        { icon: "fa-tablet", label: "E-Books", href: "#" },
      ],
    },
  },
  {
    type: "treeview",
    data: {
      icon: "fa-bullhorn",
      label: "Announcement",
      defaultOpen: true,
      children: [
        { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
        { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
        { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
      ],
    },
  },
  {
    type: "treeview",
    data: {
      icon: "fa-file-text",
      label: "Report",
      defaultOpen: true,
      children: [
        { icon: "fa-book", label: "Library Books Report", href: "#" },
        { icon: "fa-id-card", label: "Library Card Report", href: "#" },
        { icon: "fa-book", label: "Library Book Issue Report", href: "#" },
      ],
    },
  },
];

// ─── Info Boxes ──────────────────────────────────────────────────────

export const infoBoxes: InfoBoxData[] = [
  { value: 12, label: "Teacher", icon: "fa-user", bgColor: "bg-orangebox" },
  { value: 5, label: "Member", icon: "fa-user-plus", bgColor: "bg-tealbox" },
  { value: 5, label: "Books", icon: "fa-graduation-cap", bgColor: "bg-pinkbox" },
  { value: 1, label: "Issue", icon: "fa-shopping-cart", bgColor: "bg-purplebox" },
];

// ─── Profile ─────────────────────────────────────────────────────────

export const profileUser = {
  name: "User 3",
  role: "Librarian",
  avatarUrl: "https://demo.eduking.xyz/uploads/images/default.png",
};

export const profileDetails: ProfileDetailData[] = [
  { icon: "fa-user", label: "Username", value: "librarian" },
  { icon: "fa-envelope", label: "Email", value: "user3@example.com" },
  { icon: "fa-phone", label: "Phone", value: "+44078 0833 2765" },
  { icon: "fa-globe", label: "Address", value: "92 Sea Road LAMINGTON ML12 7DA" },
];

// ─── Notices ─────────────────────────────────────────────────────────

export const notices: NoticeData[] = [
  { id: 1, title: "Farewell Ceremony", description: "The most of the words adopted by the Russian langu..", actionHref: "#" },
  { id: 2, title: "Second Semester Exam", description: "Dedicated athlete, an amateur player, or a sport g..", actionHref: "#" },
  { id: 3, title: "First Semester Exam", description: "If you are a dedicated athlete, an amateur player,..", actionHref: "#" },
  { id: 4, title: "Annual Sports Day", description: "You surely are familiar with the sport language. A..", actionHref: "#" },
  { id: 5, title: "Teachers Reunion", description: "An amateur player, or a sport geek, than you surely are familiar with ..", actionHref: "#" },
];

// ─── Calendar ────────────────────────────────────────────────────────

export const calendarMonth = "July";
export const calendarYear = 2026;
export const calendarTodayDate = 8;
export const calendarDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const calendarWeeks: CalendarDay[][] = [
  [
    { day: 28, isOtherMonth: true },
    { day: 29, isOtherMonth: true },
    { day: 30, isOtherMonth: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
  ],
  [
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8, isToday: true },
    { day: 9 },
    { day: 10 },
    { day: 11 },
  ],
  [
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
  ],
  [
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
  ],
  [
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, isOtherMonth: true },
  ],
  [
    { day: 2, isOtherMonth: true },
    { day: 3, isOtherMonth: true },
    { day: 4, isOtherMonth: true },
    { day: 5, isOtherMonth: true },
    { day: 6, isOtherMonth: true },
    { day: 7, isOtherMonth: true },
    { day: 8, isOtherMonth: true },
  ],
];
