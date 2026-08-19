import type { SidebarEntry } from "./LibrariandashboardData";
import { sidebarMenuItems as librarianMenuItems } from "./LibrariandashboardData";
import { sidebarMenuItems as receptionistMenuItems } from "./receptionistDashboardData";
import { sidebarMenuItems as adminMenuItems } from "./AdminDashboardData";

export const getSidebarMenuItems = (role: string): SidebarEntry[] => {
  switch (role) {
    case "Receptionist":
      return receptionistMenuItems;
    case "Librarian":
      return librarianMenuItems;
    case "Admin":
      return adminMenuItems;
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
        {
          type: "treeview",
          data: {
            icon: "fa-money",
            label: "Payroll",
            defaultOpen: false,
            children: [
              { icon: "fa-file-text", label: "Salary Template", href: "/dashboard/payroll/salary-template" },
              { icon: "fa-clock-o", label: "Hourly Template", href: "/dashboard/payroll/hourly-template" },
              { icon: "fa-usd", label: "Manage Salary", href: "/dashboard/payroll/manage-salary" },
              { icon: "fa-credit-card", label: "Make Payments", href: "/dashboard/payroll/make-payment" },
              { icon: "fa-plus-circle", label: "Overtime", href: "/dashboard/payroll/overtime" },
            ],
          },
        },
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
