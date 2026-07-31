# 🎓 iNiLabs School Management System

[![GitHub license](https://img.shields.io/github/license/Javed-khan-7786k/inilab-school?style=for-the-badge)](https://github.com/Javed-khan-7786k/inilab-school/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v18.3-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

An enterprise-grade, full-stack **School Management Solution** designed to automate academic and administrative operations. Built with a robust **Node.js/Express/MongoDB** backend and a modern, high-contrast, responsive **React/TypeScript** frontend.

---

## 🔐 Account Login Credentials

Use the pre-configured accounts below to test different roles and permissions:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `123456` | Full system control, edit locked staff attendance, configure Message Settings |
| **Teacher** | `teacher1` | `123456` | Student attendance entry & editing, subject overview, announcements |
| **Principal / Moderator** | `principal` / `receptionist` | `123456` | Submit initial Staff Attendance, view locked records, manage visitors & enquiries |
| **Student** | `student1` | `123456` | Student portal, personal attendance view, notice board |
| **Parent** | `parent1` | `123456` | Child attendance summary, notices, fee payment status |
| **Accountant** | `accountant` | `123456` | Fee collection, financial tracking, invoices |
| **Librarian** | `librarian` | `123456` | Book cataloging, issue/return logs, library portal |
| **Receptionist** | `receptionist` | `123456` | Visitor log, enquiry management, student directory |

---

## ⚙️ Environment Configuration (`.env`)

Create `.env` files in both **`Backend/`** and **`Frontend/`** directories before starting the application:

### 1. `Backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://javedkhan7786king_db_user:72kEIpZEssh9lfSf@cluster0.irqx55n.mongodb.net/
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### 2. `Frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📦 Node Modules & Dependency Installation

Make sure Node.js (v18+) is installed. Run `npm install` inside both project directories to set up `node_modules`:

### Backend Dependencies (`Backend/`)
```bash
cd Backend
npm install
```
*Key packages:* `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`, `xlsx`.

### Frontend Dependencies (`Frontend/`)
```bash
cd ../Frontend
npm install
```
*Key packages:* `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `lucide-react`, `jspdf`, `xlsx`, `html2canvas`.

---

## 🖼️ Media & Static Assets (`uploads/images`)

- **Backend Uploads Directory**: `Backend/uploads/images/`
- **Avatar & Photo Fallbacks**: Handled automatically via standard image fallbacks and relative/absolute URL resolvers in `Frontend/src/Utils/image.ts`.
- **Allowed Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`.

---

## 🌟 Key Functional Features

### 📩 1. Message Settings & API Gateway Sender
- **Gateway Providers**: Configure credentials for **Twilio**, **MSG91**, **Fast2SMS**, or **Custom HTTP API Endpoints**..
- **Interactive Live Test SMS**: **"Test Sender API"** button in settings with real-time feedback toast.
- **Automated Absence SMS Trigger**: Automatically dispatches customized SMS alerts to parents whenever a student is marked **Absent**.
- **Template Placeholders**: `{student_name}`, `{class_name}`, `{date}`, `{notice_title}`, `{due_date}`.

### 📋 2. Student Attendance Workflow
- **Default All Present**: Loading any date pre-selects all students as **Present**.
- **Uncheck to Mark Absent**: Toggle direct checkboxes to instantly switch students between Present and Absent.
- **Multi-Filter Editing**: Filter and edit attendance records by **Date**, **Class**, and **Student Name / Roll**.

### 🔒 3. Staff Attendance Role Security
- **Principal Submission**: Principal/Staff can mark and submit daily staff attendance.
- **Admin-Only Editing**: If staff attendance for a given date is already saved in the database, non-Admin users see a lock badge (*"Only Admin can edit saved staff attendance records"*).

### 🖱️ 4. Interactive Clickable Dashboard Stat Cards
- Summary cards (**Student (6)**, **Teacher (4)**, **Parents (4)**, **Visitor Log (1)**, etc.) are interactive buttons with smart auto-routing to their respective module pages.
- **Dashboard Action Bar**: Prominent **`+ New Enquiry`** quick-action button right at the top of the dashboard.

### 📱 5. Responsive Design Across All Breakpoints
- Fully optimized layouts across `xs: 360px`, `xsm: 480px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, and `2xl: 1536px`.
- Smooth mobile sidebar drawer with overlay backdrop dismissal.

### 🛠️ 6. Recent Core Fixes & Updates
- **Dynamic Profile Routing**: Navigation to user profiles dynamically reads `userId` from `sessionStorage` rather than relying on hardcoded roles, preventing the "Invalid userId" crash.
- **Robust Attendance Database Schemas**: Migrated attendance models from `sparse` to MongoDB `partialFilterExpression` indexes, resolving `E11000 duplicate key` bulk upsert errors when teacher/student references are null.

---

## 🚀 Running the Project Locally

### Terminal 1: Backend Dev Server
```bash
cd Backend
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Terminal 2: Frontend Dev Server
```bash
cd Frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Client - React 18 / TypeScript] -->|REST API Requests| B[Express.js Server]
    B -->|Mongoose ODM| C[(MongoDB Atlas)]
    B -->|SMS Gateway Engine| D[Twilio / MSG91 / Custom Provider]
    B -->|Authentication| E[JWT Session Strategy]
    A -->|State & Context| F[LanguageContext & AuthContext]
    A -->|UI Layer| G[Tailwind CSS + High Contrast Theme]
```

---

## 👨‍💻 Repository & License
- **Author**: Javed Khan ([@Javed-khan-7786k](https://github.com/Javed-khan-7786k))
- **Repository**: [https://github.com/Javed-khan-7786k/inilab-school](https://github.com/Javed-khan-7786k/inilab-school.git)
- **License**: MIT License
