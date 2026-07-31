import type { SidebarEntry } from "./LibrariandashboardData";
import { sidebarMenuItems as librarianMenuItems } from "./LibrariandashboardData";
import { sidebarMenuItems as receptionistMenuItems } from "./receptionistDashboardData";

export const getSidebarMenuItems = (role: string): SidebarEntry[] => {
  switch (role) {
    case "Receptionist":
      return receptionistMenuItems;
    case "Librarian":
      return librarianMenuItems;
    case "Admin":
      return [
        { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
        { type: "link", data: { icon: "fa-user", label: "Teacher", href: "/dashboard/teacher" } },
        { type: "link", data: { icon: "fa-user", label: "Student", href: "/dashboard/student" } },
        { type: "link", data: { icon: "fa-user", label: "Parents", href: "/dashboard/parents" } },
        { type: "link", data: { icon: "fa-user", label: "Librarian", href: "#" } },
        { type: "link", data: { icon: "fa-user", label: "Receptionist", href: "#" } },
        {
          type: "treeview",
          data: {
            icon: "fa-user-secret",
            label: "Attendance",
            defaultOpen: false,
            children: [
              { icon: "fa-user", label: "Student Attendance", href: "/dashboard/attendance/student" },
              { icon: "fa-user", label: "Teacher Attendance", href: "/dashboard/attendance/teacher" },
              { icon: "fa-user", label: "User Attendance", href: "/dashboard/attendance/user" },
            ],
          },
        },
        { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
        { type: "link", data: { icon: "fa-user-secret", label: "Visitor Information", href: "/dashboard/visitor" } },
        { type: "link", data: { icon: "fa-list", label: "Current Enquiries", href: "/dashboard/enquiry/current" } },
        {
          type: "treeview",
          data: {
            icon: "fa-bullhorn",
            label: "Announcement",
            defaultOpen: false,
            children: [
              { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
              { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
              { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
            ],
          },
        },
      ];
    case "Teacher":
    case "Principal":
      return [
        { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
        { type: "link", data: { icon: "fa-user", label: "Student", href: "/dashboard/student" } },
        {
          type: "treeview",
          data: {
            icon: "fa-user-secret",
            label: "Attendance",
            defaultOpen: false,
            children: [
              { icon: "fa-user", label: "Student Attendance", href: "/dashboard/attendance/student" },
              { icon: "fa-user", label: "Staff Attendance", href: "/dashboard/attendance/user" },
            ],
          },
        },
        { type: "link", data: { icon: "fa-book", label: "Subject", href: "#" } },
        { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
        { type: "link", data: { icon: "fa-paper-plane", label: "Leave Apply", href: "/dashboard/leave-apply" } },
        {
          type: "treeview",
          data: {
            icon: "fa-bullhorn",
            label: "Announcement",
            defaultOpen: false,
            children: [
              { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
              { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
              { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
            ],
          },
        },
      ];
    case "Student":
      return [
        { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
        { type: "link", data: { icon: "fa-book", label: "Subject", href: "#" } },
        { type: "link", data: { icon: "fa-user-secret", label: "My Attendance", href: "#" } },
        { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
        {
          type: "treeview",
          data: {
            icon: "fa-bullhorn",
            label: "Announcement",
            defaultOpen: false,
            children: [
              { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
              { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
              { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
            ],
          },
        },
      ];
    case "Parent":
      return [
        { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
        { type: "link", data: { icon: "fa-user", label: "My Child", href: "#" } },
        { type: "link", data: { icon: "fa-user-secret", label: "Child Attendance", href: "#" } },
        { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
        {
          type: "treeview",
          data: {
            icon: "fa-bullhorn",
            label: "Announcement",
            defaultOpen: false,
            children: [
              { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
              { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
              { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
            ],
          },
        },
      ];
    case "Accountant":
      return [
        { type: "link", data: { icon: "fa-laptop", label: "Dashboard", href: "/dashboard", isActive: true } },
        { type: "link", data: { icon: "fa-shopping-cart", label: "Fee Collection", href: "#" } },
        { type: "link", data: { icon: "fa-envelope", label: "Message", href: "/dashboard/message" } },
        {
          type: "treeview",
          data: {
            icon: "fa-bullhorn",
            label: "Announcement",
            defaultOpen: false,
            children: [
              { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" },
              { icon: "fa-calendar-check-o", label: "Event", href: "/dashboard/announcement/event" },
              { icon: "fa-flag", label: "Holiday", href: "/dashboard/announcement/holiday" },
            ],
          },
        },
      ];
    default:
      return librarianMenuItems;
  }
};
