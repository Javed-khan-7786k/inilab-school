# Complete School Management System - Project Documentation

> **Note**: Yeh documentation beginner-friendly Hinglish (Hindi + English mix, Roman script) me likhi gayi hai. Iss single document me poore Frontend aur Backend project ki exhaustive detail, architecture, file-by-file breakdown, API list, Database schemas, File upload pipeline, Excel import system aur future development guides included hain.

---

## 📑 Table of Contents
1. [SECTION 1 - Project Overview & Architecture](#section-1---project-overview--architecture)
2. [SECTION 2 - Frontend Documentation (React + TypeScript + Vite)](#section-2---frontend-documentation)
3. [SECTION 3 - Backend Documentation (Node.js + Express.js)](#section-3---backend-documentation)
4. [SECTION 4 - Database Documentation (MongoDB & Mongoose)](#section-4---database-documentation)
5. [SECTION 5 - API Documentation (Complete REST Endpoints)](#section-5---api-documentation)
6. [SECTION 6 - Authentication & Authorization Flow](#section-6---authentication--authorization-flow)
7. [SECTION 7 - File Upload System (Multer & Image Processing)](#section-7---file-upload-system)
8. [SECTION 8 - Excel Import System (Bulk Data & Image Extraction)](#section-8---excel-import-system)
9. [SECTION 9 - Project Flow & Request Lifecycle](#section-9---project-flow--request-lifecycle)
10. [SECTION 10 - Dependency Documentation (NPM Packages)](#section-10---dependency-documentation)
11. [SECTION 11 - Complete Folder Structure Tree](#section-11---complete-folder-structure)
12. [SECTION 12 - How To Change Anything (Step-by-Step Practical Guide)](#section-12---how-to-change-anything)
13. [SECTION 13 - Feature Dependency Map](#section-13---feature-dependency-map)
14. [SECTION 14 - Developer Notes & Best Practices](#section-14---developer-notes)
15. [SECTION 15 - Future Development Guide](#section-15---future-development-guide)
16. [SECTION 16 - Change Impact Analysis](#section-16---change-impact-analysis)
17. [SECTION 17 - AI Developer Guide](#section-17---ai-developer-guide)

---

## SECTION 1 - Project Overview & Architecture

### 1. Project Purpose (Kis purpose ke liye bana hai)
Yeh project ek modern, full-stack **School Management System** (ERP Web Application) hai. Iss system ka main purpose educational institutions (Schools/Colleges) ke daily operations aur management ko streamline aur automate karna hai:
- Admin, Teachers, Students, Parents, Receptionists, Librarians, Accountants aur Moderators ke liye multi-role access dynamic views ke sath provide karna.
- Students, Teachers, Parents, Visitors, Notices, Events, Holidays, Leaves, aur Enquiries manage karna.
- Direct Image Uploads aur Excel File Import/Export capability ke sath bulk data processing allow karna.

### 2. Main Features
- **Multi-Role Authentication & Dashboard Dispatcher**: Role ke hisab se custom dashboard layout render hota hai (`Admin`, `Teacher`, `Student`, `Parent`, `Receptionist`, `Librarian`, `Accountant`, `Moderator`).
- **Student & Staff Management**: Add, View, Edit, Delete, Filter, Pagination, Excel Import aur Export.
- **Enquiry Management**: Detailed multi-step Admission Enquiry form, Aadhaar, APAR ID, PEN Number validation, list filtering, aur CSV/PDF export.
- **Attendance System**: Student, Teacher, aur Staff attendance views aur visual calendar tracking.
- **Visitor Management**: Visitor logs, check-in, check-out tracking, image storage.
- **Announcements**: Notices, Events, aur Holidays setup aur listing.
- **Leave Application Management**: Staff aur Students ke liye leave request apply aur status tracking.
- **Document Management**: Official document upload, viewing, aur categorization.
- **Multi-language Support (i18n)**: English aur Hindi UI toggle system context API ke dwara (`LanguageContext.tsx`).
- **Excel & PDF Export with Images**: Tables ko Excel (`exceljs`, `xlsx`) aur PDF (`jspdf`, `jspdf-autotable`) format me export karne ka unique feature jisme user dynamic embedded profile images dekh sakta hai.
- **Embedded Excel Image Extraction**: Excel sheet me paste ki gayi images ko automatically backend ZIP structure se extract karke save karna aur MongoDB documents se link karna.

### 3. Tech Stack Overview
- **Frontend Core**: React 19, TypeScript (~6.0), Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`).
- **Icons & UI**: Lucide React (`lucide-react`), Custom Modular Components.
- **State & Router**: React Router v7 (`react-router-dom`), React Context API (`LanguageContext`).
- **Form & Validation**: Formik + Yup validation schemas (`formik`, `yup`).
- **Backend Core**: Node.js (ES Modules `type: "module"`), Express.js v4.21.
- **Database**: MongoDB with Mongoose ODM v8.12.
- **Security**: JWT (`jsonwebtoken`), Bcrypt.js (`bcryptjs`), CORS (`cors`), Helmet (`helmet`), Rate Limiting (`express-rate-limit`).
- **File Upload & Parsing**: Multer v2 (Disk Storage for images, Memory Storage for Excel), XLSX (`xlsx`), AdmZip (`adm-zip`).
- **Export Utility**: ExcelJS (`exceljs`), FileSaver (`file-saver`), JsPDF (`jspdf`), JsPDF-AutoTable (`jspdf-autotable`).

### 4. High-Level Architecture Explanation
```
+-----------------------------------------------------------------------+
|                            BROWSER (CLIENT)                           |
|  React 19 SPA (Vite) + React Router v7 + Context API + Axios Client  |
+-----------------------------------------------------------------------+
                                   |
                         HTTP REST API Requests
                      (Headers: Bearer JWT Token)
                                   v
+-----------------------------------------------------------------------+
|                           EXPRESS BACKEND                             |
|  [Security: Helmet, CORS, RateLimiter] -> [Auth & Validation]         |
|  [Routes] -> [Controllers] -> [Services] -> [Multer / AdmZip]         |
+-----------------------------------------------------------------------+
                                   |
                          Mongoose Queries / I/O
                                   v
+------------------------------------+----------------------------------+
|          MONGODB DATABASE          |        LOCAL FILE SYSTEM         |
|  Collections: users, students,     |  Directory: backend/uploads/     |
|  teachers, enquiries, visitors,    |  Static Images: /uploads/images/ |
|  notices, events, holidays, etc.   |                                  |
+------------------------------------+----------------------------------+
```

---

## SECTION 2 - Frontend Documentation

### 1. Folder Structure Explanation (`src/`)

- `src/components/`: Reusable UI elements aur layout structures.
  - `ui/`: Atom components (Button, Input, Select, Modal, Badge, Icon, Spinner, Calendar, PanelCard, InfoBox, ErrorMessage).
  - `common/`: Page-level shared layout components (GenericTablePage, PageHeaderBar, ProtectedRoute).
  - `layout/`: Main application frame wrappers (Navbar, Sidebar, SidebarMenu, SidebarMenuItem, SidebarTreeView, SidebarUserPanel, LanguageDropdown, Footer, NavbarUserMenu, NavbarEnquiryMenu, DashboardLayout).
  - `cards/`, `attendance/`, `message/`, `students/`, `tables/`: Specialized feature-specific components.
- `src/pages/`: Complete View components mapped directly to React Router routes (e.g., `LoginPage.tsx`, `StudentPage.tsx`, `EnquiryFormPage.tsx`, `VisitorPage.tsx`, `DashboardDispatcher.tsx`).
- `src/context/`: Global React State Contexts (`LanguageContext.tsx` handles Hindi/English translations).
- `src/hooks/`: Custom React hooks (`useApi.ts` for API state management, `useModal.ts` for popup handling, `useSearchAndFilter.ts` for client-side search/filter).
- `src/services/`: API communication layer.
  - `api/`: Individual API files (`apiClient.ts` configured Axios instance with Bearer token interceptor, `studentApi.ts`, `userApi.ts`, `enquiryApi.ts`, etc.).
  - `authService.ts` & `dataService.ts`: Higher-level business logic wrappers around APIs.
- `src/utils/`: Helper scripts (`exportService.ts` for PDF/Excel generation, `image.ts` for photo URL normalization).
- `src/constants/`: Mock fallback datasets and navigation link hierarchies (`navigation.ts`, `mockData.ts`, `authCredentials.ts`).
- `src/types/`: TypeScript interface definitions (`index.ts` defines `Student`, `Teacher`, `User`, `Visitor`, `Enquiry`, `Notice`, `Event`, `Holiday`, `Leave`, `Document`).
- `src/config/`: App configuration files (`languages.ts`).
- `src/features/`: Entity-specific modular features (e.g. `students/data/studentData.ts`).
- *Missing folders in existing repo*: `redux/`, `routes/`, `styles/`, `assets/` (Note: Pure CSS is in `src/index.css`, routes are directly inside `App.tsx`, and state uses React Context API).

---

### 2. Deep File Analysis (Key Frontend Files)

#### 1. `src/App.tsx`
- **File Ka Kaam**: Application ka central routing container hai jahan sabhi public aur protected routes define kiye gaye hain (`<BrowserRouter>`, `<Routes>`, `<Route>`).
- **Kis File Se Connect Hai**: Sabhi page components (`pages/*`), `ProtectedRoute.tsx`, `LanguageContext.tsx`.
- **Isko Delete Kare To Kya Hoga**: Pure application ka routing breakdown ho jayega aur blank screen dikhai degi.
- **Kya Change Kar Sakte Hain**: Naye routes add kar sakte hain, route paths edit kar sakte hain.
- **Kya Nahi Change Karna Chahiye**: `<LanguageProvider>` wrapper aur `<ProtectedRoute>` hierarchy match ko break nahi karna chahiye.

#### 2. `src/services/api/apiClient.ts`
- **File Ka Kaam**: Backend standard API request calling client (`axios` instance created with base URL `http://localhost:5000/api`).
- **Kis File Se Connect Hai**: `sessionStorage`, all API files in `src/services/api/`.
- **Isko Delete Kare To Kya Hoga**: Backend se hone wali sari HTTP calls (GET, POST, PUT, DELETE) fail ho jayengi.
- **Kya Change Kar Sakte Hain**: Base URL environment variable config change kar sakte hain.
- **Kya Nahi Change Karna Chahiye**: `request.use` interceptor jo `Authorization: Bearer <token>` automatically attach karta hai, use removal ya edit nahi karna chahiye.

#### 3. `src/components/common/GenericTablePage.tsx`
- **File Ka Kaam**: Reusable Data Table screen component jo Search, Filter, Pagination, Excel Import, Excel Export, PDF Export, aur Copy to Clipboard handle karta hai.
- **Kis File Se Connect Hai**: `exportService.ts`, `useSearchAndFilter.ts`, `apiClient.ts`, `DashboardLayout.tsx`.
- **Isko Delete Kare To Kya Hoga**: StudentPage, TeacherPage, UserPage, ParentPage jaisi sari listing pages broken ho jayengi.
- **Kya Change Kar Sakte Hain**: Items per page count (default 10), buttons layout, toast notification timing.
- **Kya Nahi Change Karna Chahiye**: `importEntity` upload handler aur `exportExcelWithImages` invocation logic.

#### 4. `src/context/LanguageContext.tsx`
- **File Ka Kaam**: Multi-language support (English & Hindi) translation dictionary aur React Context provider.
- **Kis File Se Connect Hai**: Entire application (`useLanguage()` hook calls in Navbar, Sidebar, Pages).
- **Isko Delete Kare To Kya Hoga**: Application crash hoga due to missing `t()` translation function.
- **Kya Change Kar Sakte Hain**: Nayi dictionary keys aur translations add kar sakte hain.
- **Kya Nahi Change Karna Chahiye**: `t(key: string)` fallback mechanism.

#### 5. `src/components/common/ProtectedRoute.tsx`
- **File Ka Kaam**: Unauthorized users ko protected dashboard routes access karne se rokta hai aur `/login` par redirect karta hai.
- **Kis File Se Connect Hai**: `sessionStorage` (`isAuthenticated`, `userRole`), `App.tsx`.
- **Isko Delete Kare To Kya Hoga**: Unauthenticated users dashboard URL par directly navigate karke protected screens dekh payenge.
- **Kya Change Kar Sakte Hain**: Custom role permission check logic.
- **Kya Nahi Change Karna Chahiye**: Redirect condition `!isAuthenticated`.

#### 6. `src/utils/exportService.ts`
- **File Ka Kaam**: High-level export engine jo table data ko Excel (`.xlsx`) aur PDF (`.pdf`) me images render karke generate karta hai.
- **Kis File Se Connect Hai**: `exceljs`, `jspdf`, `jspdf-autotable`, `file-saver`, `GenericTablePage.tsx`.
- **Isko Delete Kare To Kya Hoga**: Export features (Excel, PDF) broken ho jayengi.
- **Kya Change Kar Sakte Hain**: PDF colors, header styles, column width.
- **Kya Nahi Change Karna Chahiye**: Image base64 conversion promise resolver.

---

### 3. Core React Concepts Implementation in Project

- **Components**: Functional components TSX syntax me likhe hain (e.g. `<Button />`, `<Modal />`).
- **Props**: Strongly typed Interfaces (TypeScript) ke through pass kiye jate hain (e.g. `interface ButtonProps { variant?: string; children: ReactNode; }`).
- **State**: React native `useState` hook se local UI states control hote hain (e.g., active tabs, current page, modal visible state).
- **Hooks**: Custom hooks `useApi` (async request handling), `useModal` (popup open/close state), aur `useSearchAndFilter` (filtering array items).
- **Routing**: `react-router-dom` v7 through client-side SPA routing (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`).
- **API Calling**: `apiClient.ts` (Axios) se centralize API requests handle hoti hain.
- **Authentication**: Login response se milne wala JWT Token aur User Role `sessionStorage` me store karke protect kiya jata hai.
- **Protected Routes**: `<ProtectedRoute>` higher-order wrapper element `sessionStorage.getItem("isAuthenticated")` verify karta hai.
- **Forms & Validation**: `EnquiryFormPage.tsx` me step-by-step form controls aur `LoginPage.tsx` me login input state validation handled hai.
- **Image Upload**: `FormData` object me file append karke `POST /api/upload/image` API request bheji jati hai.
- **Excel Import**: `<input type="file" accept=".xlsx">` event listener file capture karta hai aur `/api/import/:entity` endpoint par POST karta hai.
- **Export**: `ExcelJS` canvas aur `JsPDF` table builder through client-side document generation.
- **Reusable Components**: `GenericTablePage`, `Modal`, `PageHeaderBar`, `Input`, `Select`, `Button`.

---

## SECTION 3 - Backend Documentation

### 1. Folder Structure Explanation (`backend/src/`)

- `backend/src/config/`: Database configuration (`db.js` handles Mongoose connection with MongoDB).
- `backend/src/constants/`: System constants (`navigation.js` defines sidebar navigation tree per role).
- `backend/src/controllers/`: Express request handlers that validate HTTP inputs and format API responses.
- `backend/src/middleware/`: Express middleware functions (`auth.js`, `upload.js`, `validate.js`, `errorHandler.js`, `rateLimiter.js`).
- `backend/src/models/`: Mongoose Schemas & Models (`User.js`, `Student.js`, `Teacher.js`, `Parent.js`, `Visitor.js`, `Enquiry.js`, `Event.js`, `Holiday.js`, `Leave.js`, `Notice.js`, `Document.js`).
- `backend/src/routes/`: Express router endpoint declarations mapped to controller functions (`index.js`, `authRoutes.js`, `studentRoutes.js`, etc.).
- `backend/src/services/`: Core Business Logic layer (`importService.js`, `dashboardService.js`, `studentService.js`, `userService.js`, etc.).
- `backend/src/utils/`: Standardized helper classes (`ApiError.js`, `ApiResponse.js`, `asyncHandler.js`).
- `backend/uploads/`: Physical directory on disk where static uploaded files (`/uploads/images/`) are stored and served publicly.
- `backend/seed/`: Database initialization script (`seedData.js`) to seed default users and mock data.

---

### 2. Deep File Analysis (Key Backend Files)

#### 1. `backend/src/server.js`
- **Purpose**: Main entry point of Node Express server. Bootstraps environment variables, connects MongoDB, applies middlewares (Helmet, CORS, RateLimiter, BodyParser, Static Uploads), mounts API routes, and starts HTTP server on port 5000.
- **Input**: Environment variables (`.env`).
- **Output**: Running Express HTTP Server.
- **Dependencies**: `express`, `cors`, `helmet`, `dotenv`, `./config/db.js`, `./routes/index.js`.
- **Database Connection**: Calls `connectDB()`.

#### 2. `backend/src/middleware/auth.js`
- **Purpose**: Protects API endpoints by verifying JWT Bearer token from `Authorization` HTTP request header.
- **Input**: `req.headers.authorization` ("Bearer `<token>`").
- **Output**: Attaches user object to `req.user` if valid; otherwise throws `401 Unauthorized` ApiError.
- **Dependencies**: `jsonwebtoken`, `User.js`, `ApiError.js`.

#### 3. `backend/src/middleware/upload.js`
- **Purpose**: Handles file upload validation and storage configuration using Multer.
- **Input**: HTTP Multipart Form Data (`multipart/form-data`).
- **Output**: Memory Buffer for XLSX (`xlsxUpload`), Disk File for Images (`imageUpload`).
- **Disk Path**: `backend/uploads/images/`.
- **Validation**: Image file types (`JPEG`, `PNG`, `WEBP`) limit 5MB. Excel file type (`.xlsx`) limit 10MB.

#### 4. `backend/src/services/importService.js`
- **Purpose**: Parses uploaded Excel sheet, extracts embedded drawing images using `adm-zip`, normalizes headers with aliases, hashes user passwords, and bulk inserts documents into MongoDB.
- **Input**: Excel file Buffer, Entity string (`students`, `teachers`, `users`).
- **Output**: `{ insertedCount, imported, failed, skippedRows, errors }`.
- **Dependencies**: `xlsx`, `adm-zip`, `crypto`, `fs`, `bcryptjs`, `Student`, `Teacher`, `User`.

#### 5. `backend/src/controllers/uploadController.js`
- **Purpose**: Handles standalone image uploads and optionally updates an existing MongoDB document's `photo` attribute.
- **Input**: `req.file`, query parameters `?model=students&id=...`.
- **Output**: Public URL string `http://localhost:5000/uploads/images/<filename>`.

#### 6. `backend/src/utils/ApiError.js` & `ApiResponse.js`
- **Purpose**: Standardizes error handling and success API response payloads across all backend endpoints.
- **Success Format**: `{ success: true, message: string, data: any }`.
- **Error Format**: `{ success: false, statusCode: number, message: string, errors: array }`.

---

## SECTION 4 - Database Documentation

### 1. Database Specifications
- **Database Name**: `school_management` (configurable via `MONGODB_URI` env variable).
- **ODM**: Mongoose v8.12.

---

### 2. Collections & Schema Details

#### 1. `users` Collection (`backend/src/models/User.js`)
- **Purpose**: System accounts for authentication and role-based access.
- **Fields**:
  - `username` (String, Required, Unique, Indexed, min length 3)
  - `password` (String, Required, Min length 6, Hashed via Bcrypt pre-save)
  - `role` (String, Required, Indexed, Enum: `["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist", "Moderator"]`)
  - `name` (String, Required, Trimmed)
  - `email` (String, Optional)
  - `phone` (String, Optional)
  - `photo` (String, Default: `"https://demo.eduking.xyz/uploads/images/default.png"`)
  - `gender`, `dob`, `joiningDate`, `religion`, `address`, `designation`, `department`, `class`, `section`, `roll` (Strings, Optional)
  - `createdAt`, `updatedAt` (Timestamps)
- **Virtuals & Serialization**: `id` mapped from `_id`. Password stripped during JSON output.

#### 2. `students` Collection (`backend/src/models/Student.js`)
- **Purpose**: Primary student record repository.
- **Fields**:
  - `name` (String, Required)
  - `roll` (String, Required)
  - `className` (String, Required)
  - `email` (String, Optional)
  - `photo` (String, Default avatar URL)
- **Virtuals**: `id` mapped from `_id`.

#### 3. `teachers` Collection (`backend/src/models/Teacher.js`)
- **Fields**: `name` (Required), `designation` (Required), `email`, `photo`.

#### 4. `enquiries` Collection (`backend/src/models/Enquiry.js`)
- **Purpose**: Admission enquiries.
- **Fields**: `studentName`, `applyingClass`, `dob`, `gender`, `fatherName`, `fatherOccupation`, `fatherContact`, `fatherEmail`, `motherName`, `motherOccupation`, `motherContact`, `motherEmail`, `address`, `state`, `district`, `pinCode` (All Required), `photo`, `status` (Enum: `New`, `Contacted`, `Follow-up`, `Admission Confirmed`, `Rejected`, `Closed`), `createdBy` (Ref: `User` ObjectId, Required).

#### 5. Other Collections
- `parents`, `visitors`, `notices`, `events`, `holidays`, `leaves`, `documents`.

---

### 3. Data Flow & CRUD Lifecycle
```
[Frontend Form / Action] ──(Axios JSON / FormData)──> [Express Route]
                                                           │
                                                  [Auth & Validation]
                                                           │
                                                  [Controller Method]
                                                           │
                                                  [Service / Mongoose]
                                                           │
                                                 ┌─────────┴─────────┐
                                                 ▼                   ▼
                                          [MongoDB Query]     [Disk File Storage]
```

---

## SECTION 5 - API Documentation

Below is the complete reference of all REST API endpoints available in the system:

| Method | Endpoint Route | Purpose | Controller | Auth Required | Request Body / Params | Output Data Format |
|---|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | User Login & Token Issue | `authController.login` | No | `{ username, password }` | `{ token, user }` |
| `GET` | `/api/auth/me` | Current Profile Fetch | `authController.getMe` | Yes (Bearer) | None | `{ id, username, role, ... }` |
| `GET` | `/api/students` | Get all students | `studentController.getStudents` | Yes | Query: `?search=&className=` | Array of Students |
| `POST` | `/api/students` | Create new student | `studentController.createStudent` | Yes | `{ name, roll, className, email, photo }` | Created Student Object |
| `PUT` | `/api/students/:id` | Update student by ID | `studentController.updateStudent` | Yes | Student update fields | Updated Student Object |
| `DELETE` | `/api/students/:id` | Delete student | `studentController.deleteStudent` | Yes | URL Param: `id` | `{ id }` |
| `GET` | `/api/teachers` | Get all teachers | `teacherController.getTeachers` | Yes | None | Array of Teachers |
| `POST` | `/api/teachers` | Create teacher | `teacherController.createTeacher` | Yes | Teacher fields | Created Teacher |
| `PUT` | `/api/teachers/:id` | Update teacher | `teacherController.updateTeacher` | Yes | Teacher fields | Updated Teacher |
| `DELETE` | `/api/teachers/:id` | Delete teacher | `teacherController.deleteTeacher` | Yes | URL Param: `id` | `{ id }` |
| `GET` | `/api/parents` | Get all parents | `parentController.getParents` | Yes | None | Array of Parents |
| `GET` | `/api/users` | Get all system users | `userController.getUsers` | Yes | Query: `?role=` | Array of Users |
| `POST` | `/api/users` | Create system user | `userController.createUser` | Yes | User Schema fields | Created User |
| `GET` | `/api/visitors` | Get all visitors | `visitorController.getVisitors` | Yes | None | Array of Visitors |
| `POST` | `/api/visitors` | Log visitor entry | `visitorController.createVisitor` | Yes | Visitor fields | Created Visitor |
| `GET` | `/api/enquiries` | Get all enquiries | `enquiryController.getEnquiries` | Yes | Query: `?status=` | Array of Enquiries |
| `POST` | `/api/enquiries` | Create new enquiry | `enquiryController.createEnquiry` | Yes | Multi-field Enquiry object | Created Enquiry |
| `PUT` | `/api/enquiries/:id`| Update enquiry | `enquiryController.updateEnquiry` | Yes | Enquiry update fields | Updated Enquiry |
| `POST` | `/api/import/:entity`| Excel file bulk import | `importController.importExcel` | Yes | `multipart/form-data` (`file`) | `{ insertedCount, skippedRows }` |
| `POST` | `/api/upload/image` | Image upload to disk | `uploadController.uploadImage` | Yes | `multipart/form-data` (`image`) | `{ imageUrl }` |
| `GET` | `/api/dashboard/stats`| Dashboard stats count | `dashboardController.getStats` | Yes | Query: `?role=` | Summary counts object |
| `GET` | `/api/navigation` | Sidebar menu tree | `navigationController.getNavigation`| Yes | Derived from `req.user.role` | Tree nodes array |

---

## SECTION 6 - Authentication & Authorization Flow

### 1. Login Lifecycle
1. User login credentials (`username`, `password`) fill karta hai on `/login`.
2. Frontend `authService.login()` hit karta hai `POST /api/auth/login`.
3. Backend `User.findOne({ username })` find karta hai aur `user.comparePassword(password)` execution karta hai using Bcrypt.
4. Success par JWT Token generate hota hai using `jsonwebtoken`:
   ```javascript
   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
   ```
5. Response Object:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
       "user": { "id": "60b8d6...", "username": "admin", "role": "Admin", "name": "System Admin" }
     }
   }
   ```
6. Frontend `sessionStorage` me write karta hai:
   - `token`
   - `userRole`
   - `isAuthenticated = "true"`
7. Browser navigate karta hai `/dashboard` par.

---

### 2. Authorization & Role-Based Access Control (RBAC)
- Client-side par `<ProtectedRoute allowedRoles={['Admin', 'Teacher']}>` component invalid roles ko access nahi karne deta.
- Backend par `auth.js` middleware token parse karke `req.user` set karta hai.

---

## SECTION 7 - File Upload System

### Complete Image Upload Pipeline

```
[ Frontend ]
User Selects Image File
       │
FormData.append('image', file)
       │
POST /api/upload/image (Content-Type: multipart/form-data)
       │
       ▼
[ Backend Express ]
       │
`imageUpload` Middleware (Multer Disk Storage)
├── Validate Mimetype (jpeg, png, webp)
├── Validate Size (< 5MB)
└── Store to disk: backend/uploads/images/<randomUUID>.<ext>
       │
       ▼
`uploadController.js`
Constructs URL: http://localhost:5000/uploads/images/<randomUUID>.<ext>
(Optional: If query ?model=students&id=123 is present, updates Student photo field)
       │
       ▼
Returns JSON Response with `imageUrl` to Frontend
       │
       ▼
[ MongoDB Save ]
Document's photo attribute receives URL string:
"http://localhost:5000/uploads/images/f47ac10b-58cc-4372-a567-0e02b2c3d479.png"
```

---

## SECTION 8 - Excel Import System

### Step-by-Step Execution Flow
1. **Frontend Selection**: User generic table page par "Import Excel" button click karke `.xlsx` file select karta hai.
2. **API Request**: Axios `POST /api/import/:entity` (`students`, `teachers`, `users`) request FormData file ke sath dispatch hoti hai.
3. **Multer Memory Processing**: Backend `xlsxUpload` middleware file content ko disk par write kiye bina Node.js memory `Buffer` me hold karta hai.
4. **ZIP Archive Inspection (`AdmZip`)**:
   - `.xlsx` file internally ek ZIP container hoti hai. `importService.js` `AdmZip(buffer)` load karta hai.
   - `xl/media/` folder me available saari embedded images (`image1.png`, `image2.jpeg`) extract ki jaati hain.
   - `xl/drawings/drawing1.xml` aur `_rels` files ko parse karke Excel row numbers ko extract image files se map kiya jata hai.
   - Extracted images disk path `backend/uploads/images/<uuid>.<ext>` par save karke URL generate ki jaati hai.
5. **Text & Column Normalization (`XLSX.read`)**:
   - Header strings to alias values mapping hoti hai (e.g. "Roll No", "roll_number" -> `roll`).
6. **Password Hashing**: User entity import ke case me `bcrypt.hash()` execute hota hai.
7. **Bulk Database Insert**: Mongoose `Model.insertMany(documents, { ordered: false })` call hota hai. If some rows duplicate, non-duplicate rows execute target insertion.
8. **Summary Response**: Frontend ko imported count aur skipped duplicate rows list render ki jaati hai.

---

## SECTION 9 - Project Flow & Request Lifecycle

### End-to-End Request Lifecycle Diagram

```
+-------------------------------------------------------------------------+
| BROWSER                                                                 |
| User interacts with UI (e.g., Clicks "Add Student")                     |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| REACT SPA FRONTEND                                                      |
| 1. StudentPage.tsx captures Form State                                  |
| 2. studentApi.createStudent(data) called                                |
| 3. apiClient (Axios) adds Header Authorization: Bearer <token>          |
+-------------------------------------------------------------------------+
                                    │
                               HTTP POST /api/students
                                    ▼
+-------------------------------------------------------------------------+
| EXPRESS BACKEND (server.js)                                             |
| 1. Helmet & CORS security check passed                                  |
| 2. RateLimiter verified                                                 |
| 3. Route matched in routes/studentRoutes.js                             |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| MIDDLEWARE LAYER (auth.js)                                              |
| 1. JWT token verified via process.env.JWT_SECRET                        |
| 2. req.user attached                                                    |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| CONTROLLER LAYER (studentController.js)                                 |
| 1. Input payload validation                                             |
| 2. Calls studentService.createStudent(req.body)                         |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| SERVICE & DATABASE LAYER (studentService.js -> Student.js)             |
| 1. Mongoose Model instance created                                      |
| 2. Query executed: await Student.create(data)                           |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| MONGODB SERVER                                                          |
| Document written to 'students' collection                               |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| RESPONSE SENT BACK                                                      |
| ApiResponse.success(res, "Student created successfully", newStudent)    |
+-------------------------------------------------------------------------+
```

---

## SECTION 10 - Dependency Documentation

### 1. Frontend Dependencies (`package.json`)

| Package Name | Version | Purpose | Usage File Location |
|---|---|---|---|
| `react` | `^19.2.7` | UI Library Core | All `.tsx` files |
| `react-dom` | `^19.2.7` | DOM Renderer for React | `src/main.tsx` |
| `react-router-dom` | `^7.18.1` | Client Side SPA Router | `src/App.tsx`, `ProtectedRoute.tsx` |
| `axios` | `^1.18.1` | HTTP Client for API calls | `src/services/api/apiClient.ts` |
| `tailwindcss` & `@tailwindcss/vite` | `^4.3.3` | Styling framework | `vite.config.ts`, `src/index.css` |
| `lucide-react` | `^1.25.0` | SVG Icon Library | `src/components/ui/Icon.tsx` |
| `exceljs` | `^4.4.0` | Advanced Excel Sheet creation with Images | `src/utils/exportService.ts` |
| `xlsx` | `^0.18.5` | Client-side spreadsheet parser | `src/utils/exportService.ts`, `GenericTablePage.tsx` |
| `jspdf` & `jspdf-autotable` | `^2.5.2` | PDF Document & Table generation | `src/utils/exportService.ts` |
| `file-saver` | `^2.0.5` | Client-side File Download Helper | `src/utils/exportService.ts` |
| `formik` & `yup` | `^2.4.9` | Form State & Schema Validation | `src/pages/EnquiryFormPage.tsx` |

---

### 2. Backend Dependencies (`backend/package.json`)

| Package Name | Version | Purpose | Usage File Location |
|---|---|---|---|
| `express` | `^4.21.2` | Web Application Server Framework | `backend/src/server.js` |
| `mongoose` | `^8.12.1` | MongoDB Object Data Modeling (ODM) | `backend/src/config/db.js`, Models |
| `jsonwebtoken` | `^9.0.2` | Authentication Token issue & verify | `backend/src/middleware/auth.js`, `authService.js` |
| `bcryptjs` | `^2.4.3` | Password Hashing | `backend/src/models/User.js`, `importService.js` |
| `multer` | `^2.2.0` | File Upload Handler | `backend/src/middleware/upload.js` |
| `adm-zip` | `^0.6.0` | Extract embedded images from XLSX ZIP | `backend/src/services/importService.js` |
| `xlsx` | `^0.18.5` | Excel Sheet JSON converter | `backend/src/services/importService.js` |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing | `backend/src/server.js` |
| `helmet` | `^8.1.0` | Express HTTP Security Headers | `backend/src/server.js` |
| `express-rate-limit` | `^7.5.0` | Prevents Brute Force API attacks | `backend/src/middleware/rateLimiter.js` |
| `dotenv` | `^16.4.7` | Environment variables loader | `backend/src/server.js` |

---

## SECTION 11 - Complete Folder Structure

```
Internship/
├── .gitignore                      # Git ignore rule specifications
├── README.md                       # Repository overview documentation
├── eslint.config.js                # ESLint configuration rules
├── index.html                      # Single Page Application HTML entry root
├── package.json                    # Frontend Node dependencies & scripts
├── tsconfig.json                   # TypeScript master compiler config
├── vite.config.ts                  # Vite bundler configuration
│
├── public/                         # Public static web assets
│
├── src/                            # Frontend React Source Code
│   ├── App.tsx                     # Master React Router route setup
│   ├── index.css                   # Global Tailwind CSS styles
│   ├── main.tsx                    # React DOM render entry point
│   │
│   ├── components/                 # Reusable UI Components
│   │   ├── common/                 # Page level shared components
│   │   │   ├── GenericTablePage.tsx # Master table component with filter, export, import
│   │   │   ├── PageHeaderBar.tsx   # Standard page top bar
│   │   │   └── ProtectedRoute.tsx  # Authentication route guard wrapper
│   │   ├── layout/                 # Main App Frame Layout
│   │   │   ├── DashboardLayout.tsx # Main dashboard frame wrapper
│   │   │   ├── Navbar.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Left sidebar drawer
│   │   │   └── LanguageDropdown.tsx# Language switcher dropdown
│   │   └── ui/                     # Basic Atomic UI Controls
│   │       ├── Button.tsx          # Standard button component
│   │       ├── Input.tsx           # Form input component
│   │       ├── Modal.tsx           # Reusable popup dialog
│   │       └── Icon.tsx            # Lucide icon dynamic renderer
│   │
│   ├── context/                    # React Context State Providers
│   │   └── LanguageContext.tsx     # English/Hindi translations context
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useApi.ts               # Async API call execution hook
│   │   ├── useModal.ts             # Modal open/close state hook
│   │   └── useSearchAndFilter.ts   # Table filter & search state hook
│   │
│   ├── pages/                      # Application Page Views
│   │   ├── LoginPage.tsx           # Login screen view
│   │   ├── DashboardDispatcher.tsx # Role based dashboard view switcher
│   │   ├── StudentPage.tsx         # Student directory table view
│   │   ├── TeacherPage.tsx         # Teacher directory table view
│   │   ├── VisitorPage.tsx         # Visitor management view
│   │   ├── EnquiryFormPage.tsx     # Admission enquiry multi-step form view
│   │   └── EnquiryListPage.tsx     # Enquiry records listing view
│   │
│   ├── services/                   # Frontend API Client Layer
│   │   ├── api/                    # Individual REST API modules
│   │   │   ├── apiClient.ts        # Axios client instance with Bearer Auth
│   │   │   ├── studentApi.ts       # Student API endpoints
│   │   │   └── userApi.ts          # User API endpoints
│   │   └── authService.ts          # Authentication service logic
│   │
│   ├── types/                      # TypeScript Global Type Declarations
│   │   └── index.ts                # App interfaces (Student, User, etc.)
│   │
│   └── utils/                      # Helper Utilities
│       ├── exportService.ts        # ExcelJS & JsPDF export engine
│       └── image.ts                # Image URL resolver
│
├── backend/                        # Node.js + Express + MongoDB Backend
│   ├── .env                        # Active Environment Variables
│   ├── .env.example                # Sample Environment Template
│   ├── package.json                # Backend dependencies & npm scripts
│   │
│   ├── seed/                       # Database Initializer Scripts
│   │   └── seedData.js             # Initial database seed data script
│   │
│   ├── uploads/                    # Physical Upload Storage
│   │   └── images/                 # Saved uploaded profile & entity images
│   │
│   └── src/                        # Backend Application Code
│       ├── server.js               # Node Express server bootstrapping
│       ├── config/                 # DB Connections
│       │   └── db.js               # Mongoose MongoDB connection setup
│       ├── constants/              # System Constant Declarations
│       │   └── navigation.js       # Role navigation tree configs
│       ├── controllers/            # Controller Handlers
│       │   ├── authController.js   # Auth controller
│       │   ├── studentController.js# Student controller
│       │   ├── importController.js # Excel import controller
│       │   └── uploadController.js # Image upload controller
│       ├── middleware/             # Express Middlewares
│       │   ├── auth.js             # JWT Verification Middleware
│       │   ├── upload.js           # Multer Upload Configuration
│       │   └── errorHandler.js     # Global Express Error Handler
│       ├── models/                 # Mongoose Data Schemas
│       │   ├── User.js             # User model
│       │   ├── Student.js          # Student model
│       │   └── Enquiry.js          # Enquiry model
│       ├── routes/                 # Express REST Routers
│       │   ├── index.js            # Router hub loader
│       │   ├── authRoutes.js       # Auth endpoints
│       │   ├── studentRoutes.js    # Student endpoints
│       │   └── importRoutes.js     # Import endpoints
│       ├── services/               # Core Business Logic Layer
│       │   ├── importService.js    # Excel parsing & Image extraction logic
│       │   └── studentService.js   # Student business operations
│       └── utils/                  # Helper Classes
│           ├── ApiError.js         # Custom API Error class
│           └── ApiResponse.js      # Custom API Response formatter
│
└── docs/                           # Documentation Root
    └── project-documentation.md   # Single comprehensive project doc file
```

---

## SECTION 12 - How To Change Anything (Step-by-Step Practical Guide)

### Concrete Example: Student Form aur Record me "Date of Birth (dob)" field add karna

Agar aapko project me ek nayi field (e.g. `dob`) add karni ho, to niche diye gaye sequence me steps follow kare:

#### STEP 1: Backend Database Model Modify Kare (`backend/src/models/Student.js`)
Schema definition me field specify kare:
```javascript
dob: { type: String, trim: true }
```

#### STEP 2: Backend Import Service Configuration Update Kare (`backend/src/services/importService.js`)
Excel import column support allow karne ke liye:
```javascript
students: {
  model: Student,
  requiredColumns: ["name", "roll"],
  allColumns: ["name", "roll", "className", "email", "photo", "dob"], // <-- Add dob
}
```

#### STEP 3: Frontend TypeScript Types Update Kare (`src/types/index.ts`)
Interface contract modify kare:
```typescript
export interface Student {
  id: string;
  name: string;
  roll: string;
  className: string;
  email?: string;
  photo?: string;
  dob?: string; // <-- Add dob optional string
}
```

#### STEP 4: Frontend Component Columns Update Kare (`src/pages/StudentPage.tsx`)
Table rendering columns list update kare:
```typescript
const columns: Column<Student>[] = [
  // existing columns...
  { key: 'dob', label: t('Date of Birth') },
];
```

#### STEP 5: Export Service Data Mapping Update Kare (`src/utils/exportService.ts`)
Excel/PDF export column header set kare.

---

## SECTION 13 - Feature Dependency Map

Below is the dependency map for major features in the application:

```
[ STUDENT MODULE ]
StudentPage.tsx ──> studentApi.ts ──> studentRoutes.js ──> studentController.js ──> studentService.js ──> Student.js ──> MongoDB ('students')

[ ENQUIRY MODULE ]
EnquiryFormPage.tsx ──> enquiryApi.ts ──> enquiryRoutes.js ──> enquiryController.js ──> enquiryService.js ──> Enquiry.js ──> MongoDB ('enquiries')

[ EXCEL IMPORT MODULE ]
GenericTablePage.tsx ──> apiClient (POST /import/:entity) ──> importRoutes.js ──> importController.js ──> importService.js ──> AdmZip + XLSX ──> Mongoose Bulk Write

[ IMAGE UPLOAD MODULE ]
Image UI / Modal ──> apiClient (POST /upload/image) ──> uploadRoutes.js ──> upload.js (Multer) ──> uploadController.js ──> Disk ('/uploads/images') ──> Document Photo URL
```

---

## SECTION 14 - Developer Notes & Best Practices

1. **Environment Variables**:
   - Secrets file `backend/.env` me hote hain. Production me `JWT_SECRET` aur `MONGODB_URI` environment parameters hamesha change kare.
2. **Static Upload serving**:
   - Express static middleware `app.use("/uploads", express.static("uploads"))` path `/uploads` ko publicly host karta hai.
3. **SessionStorage Clean Security**:
   - Logout hone par `sessionStorage.clear()` invoke hota hai. Sensitivity avoid karne ke liye plain passwords ya confidential state direct client storage me write mat kare.
4. **Error Handling Pattern**:
   - Backend me standard errors output dene ke liye custom `ApiError` throwing model enforce kare:
     ```javascript
     throw ApiError.badRequest("Invalid data payload");
     ```

---

## SECTION 15 - Future Development Guide

### Naya Module (e.g., "Library Book Management") Add Karne Ka Process

1. **Backend Model Create Kare**:
   `backend/src/models/Book.js` create karke Mongoose schema define kare.
2. **Backend Service & Controller Create Kare**:
   `bookService.js` aur `bookController.js` build kare.
3. **Backend Route Register Kare**:
   `backend/src/routes/bookRoutes.js` create karke `backend/src/routes/index.js` me `router.use("/books", bookRoutes)` line mount kare.
4. **Frontend API Module Add Kare**:
   `src/services/api/bookApi.ts` write kare using `apiClient`.
5. **Frontend Interface Add Kare**:
   `src/types/index.ts` me `export interface Book { ... }` declaration kare.
6. **Frontend Page Build Kare**:
   `src/pages/BookPage.tsx` create karke `<GenericTablePage>` wrap kare.
7. **App Router Mount Kare**:
   `src/App.tsx` me ProtectedRoute wrap path `/dashboard/books` add kare.

---

## SECTION 16 - Change Impact Analysis

Niche table me major project files me change hone par padne wale high-level impacts summarized hain:

| Target Modified File | Primary Direct Impact | Secondary Affected Files |
|---|---|---|
| `backend/src/models/User.js` | User DB Schema structure | `authService.js`, `userService.js`, `importService.js`, `LoginPage.tsx` |
| `backend/src/middleware/auth.js` | Token Bearer Validation logic | All Protected Backend API routes |
| `backend/src/services/importService.js` | Excel parsing & extraction logic | `importController.js`, `GenericTablePage.tsx`, Bulk Excel Uploads |
| `src/services/api/apiClient.ts` | Axios HTTP Client instance | All frontend API calls, Authorization Header |
| `src/components/common/GenericTablePage.tsx` | Central Table View UI | `StudentPage.tsx`, `TeacherPage.tsx`, `UserPage.tsx`, `ParentPage.tsx` |
| `src/utils/exportService.ts` | PDF & Excel generation logic | Export buttons across all directory pages |

---

## SECTION 17 - AI Developer Guide

Future AI coding assistants jo iss repository par kaam karenge, unke liye strictly follow karne wale instructions:

1. **Do NOT Break Existing API Response Contract**:
   - Backend APIs hamesha `ApiResponse.success(res, message, data)` format reject ya return kare, custom unformatted JSON response payload send na kare.
2. **Schema & Model Consistency**:
   - Every Mongoose model must convert `_id` to Virtual `id` attribute on `toJSON` output so that TypeScript interfaces receive consistent `id` keys.
3. **Strict Validation**:
   - Dynamic user payload backend controllers me sanitize or validate hone chahiye to prevent injections or invalid state.
4. **Preserve Language Context Utility**:
   - Frontend components me direct hardcoded display text add karne ke bajaye `const { t } = useLanguage()` reference call execute kare.
5. **File Upload Handling Rules**:
   - File uploads hamesha Multer error middleware `handleMulterError` pass karke process kare taaki file limit errors proper 400 Bad Request standard format me client ko mile.
6. **ES Module Imports**:
   - Backend `package.json` me `"type": "module"` configured hai. Backend files me local imports include explicit `.js` extension (e.g. `import User from "../models/User.js"`).

---
*End of Documentation — School Management System (Frontend + Backend)*
