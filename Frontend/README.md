# iNiLabs School Management System

A modern, full-featured **School Management System** built with React, TypeScript, and Vite. Designed with a rich UI to manage students, teachers, parents, users, attendance, notices, events, holidays, media, leave applications, visitor information, and messaging.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **React Router v6** | Client-side Routing |
| **Tailwind CSS** | Utility-first Styling |
| **Font Awesome** | Icon Library |

---

## ✨ Features

### 🔐 Authentication
- Role-based login system supporting: **Admin**, **Teacher**, **Student**, **Parent**, **Receptionist**, **Librarian**
- Session-based authentication with protected routes

### 👥 User Management
- **Students**, **Teachers**, **Parents**, **Users** — full list views with profile actions
- Profile detail view with **Profile**, **Attendance**, and **Document** tabs
- Attendance calendar grid (12 months × 31 days) with color-coded statuses

### 📋 Attendance
- Student Attendance, Teacher Attendance, User Attendance
- Monthly calendar grid view with legend (Present, Absent, Holiday, Weekend, Late, Leave)
- Summary stats per individual

### 📢 Announcements
- **Notice**, **Event**, and **Holiday** pages with detail modals
- Notification bell in navbar redirects to Notice page

### 📬 Messaging
- Inbox view with folder navigation (Inbox, Sent, Drafts, Trash)
- Compose message modal, search & filter support

### 📁 Media
- Grid-based file/folder browser
- Drag-and-drop upload area
- Create/delete files and folders

### 🏖️ Leave Management
- Leave application list with status badges (Approved / Pending / Rejected)
- Apply Leave modal form with date range, reason, and attachment

### 🧑‍💼 Visitor Information
- Visitor list with Check In / Check Out status
- Add visitor form with dynamic status tracking

### 📊 Dashboard
- Role-specific dashboards with stats cards, announcements, and quick links
- Breadcrumbs, notification bell, multi-language selector, and user menu

### 🌍 Multi-Language Support
- English, Arabic, Bengali, Chinese, French, German
- RTL-aware layout for Arabic

---

## 📁 Project Structure

```
src/
├── components/
│   ├── attendance/     # Attendance calendar subcomponents
│   ├── cards/          # ProfileCard, StatsCard, etc.
│   ├── layout/         # DashboardLayout, Navbar, Sidebar, NavbarUserMenu
│   ├── message/        # MessageSidebar, MessageToolbar, MessageTable
│   └── ui/             # Icon, shared UI primitives
├── constants/          # Static dashboard config data per role
├── context/            # LanguageContext (i18n translations)
├── pages/              # All page-level components
│   ├── DetailViewPage.tsx
│   ├── LeaveApplyPage.tsx
│   ├── MediaPage.tsx
│   ├── MessagePage.tsx
│   ├── NoticePage.tsx
│   ├── EventPage.tsx
│   ├── HolidayPage.tsx
│   ├── VisitorPage.tsx
│   └── ...
└── App.tsx             # Root routes definition
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/inilab-school.git

# Navigate into the project
cd inilab-school

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| Receptionist | receptionist | 123456 |
| Librarian | librarian | 123456 |
| Admin | admin | 123456 |

---

## 📸 Screenshots

> Dashboard, Profile view, Attendance calendar, Notice board, and more — all available on the live demo.

---

## 📄 License

This project is built for educational purposes as part of an internship program.

---

## 🙏 Acknowledgements

- [iNiLabs](https://inilabs.com/) — Original design inspiration
- [Vite](https://vitejs.dev/) — Ultra-fast build tool
- [React](https://react.dev/) — UI library
