# Convert to Full-Stack MERN Application

Replace all hardcoded/static data with a MongoDB-backed Express.js REST API while preserving 100% of the existing UI and functionality.

---

## Static Data Sources Identified

Every piece of data the frontend currently uses comes from these files:

| Source File | Data | Replacement |
|---|---|---|
| [authCredentials.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/constants/authCredentials.ts) | 7 user credentials (username/password/role) | `User` MongoDB collection + `/api/auth/login` |
| [mockData.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/constants/mockData.ts) | Students, Teachers, Parents, Visitors, Notices, Events, Holidays, Leaves, Documents, Profiles, Users | Individual MongoDB collections + REST APIs |
| [librarianDashboardData.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/constants/librarianDashboardData.ts) | Sidebar menus, InfoBoxes, profile, notices, calendar | `/api/dashboard` API |
| [receptionistDashboardData.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/constants/receptionistDashboardData.ts) | Sidebar menus, InfoBoxes, profile, notices, calendar | `/api/dashboard` API |
| [navigation.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/constants/navigation.ts) | Role-based sidebar menus for 7 roles | `/api/navigation/:role` API |
| [dataService.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/services/dataService.ts) | In-memory CRUD operations | Replaced by API calls |
| [authService.ts](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/services/authService.ts) | `sessionStorage`-based auth with hardcoded credentials | JWT-based auth via `/api/auth` |

---

## MongoDB Schema Design

### Collection Relationship Diagram (text)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │     │ Student  │     │ Teacher  │
│(auth/all)│     │          │     │          │
└────┬─────┘     └──────────┘     └──────────┘
     │
     │ role
     ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Parent  │     │ Visitor  │     │  Notice  │
│          │     │  toMeet→ │     │          │
└──────────┘     │  Parent  │     └──────────┘
                 └──────────┘
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Event   │     │ Holiday  │     │  Leave   │
│          │     │          │     │ applicant│
└──────────┘     └──────────┘     │  →User   │
                                  └──────────┘
┌──────────┐     ┌──────────────┐  ┌───────────┐
│ Document │     │  Attendance  │  │ Dashboard │
│ owner→   │     │  user→User   │  │  Config   │
│  User    │     │              │  │           │
└──────────┘     └──────────────┘  └───────────┘
```

### 10 Collections

1. **users** — Authentication + profile (replaces `authCredentials.ts`, `MOCK_USERS`, `MOCK_PROFILE_REGISTRY`)
2. **students** — Student records (replaces `MOCK_STUDENTS`)
3. **teachers** — Teacher records (replaces `MOCK_TEACHERS`)
4. **parents** — Parent records (replaces `MOCK_PARENTS`)
5. **visitors** — Visitor log (replaces `INITIAL_VISITORS`)
6. **notices** — Notice board (replaces `INITIAL_NOTICES`)
7. **events** — Events list (replaces `INITIAL_EVENTS`)
8. **holidays** — Holiday calendar (replaces `INITIAL_HOLIDAYS`)
9. **leaves** — Leave applications (replaces `MOCK_LEAVES`)
10. **documents** — Document records (replaces `MOCK_DOCUMENTS`)

> [!NOTE]
> **Dashboard InfoBoxes, Navigation, and Calendar** are computed server-side from collection counts + date calculations. They do not need their own collections — the `/api/dashboard` and `/api/navigation` endpoints will compute them dynamically.

---

## Proposed Changes

### Phase 1: Backend Foundation

#### [NEW] `backend/` directory

Complete Express.js backend with this structure:

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection with reconnect + graceful shutdown
│   ├── constants/
│   │   └── navigation.js      # Role-based sidebar menu definitions (moved from frontend)
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   ├── validate.js         # Request validation middleware
│   │   └── rateLimiter.js      # Rate limiting
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Parent.js
│   │   ├── Visitor.js
│   │   ├── Notice.js
│   │   ├── Event.js
│   │   ├── Holiday.js
│   │   ├── Leave.js
│   │   └── Document.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── parentController.js
│   │   ├── visitorController.js
│   │   ├── noticeController.js
│   │   ├── eventController.js
│   │   ├── holidayController.js
│   │   ├── leaveController.js
│   │   ├── documentController.js
│   │   ├── dashboardController.js
│   │   └── navigationController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── teacherService.js
│   │   ├── parentService.js
│   │   ├── visitorService.js
│   │   ├── noticeService.js
│   │   ├── eventService.js
│   │   ├── holidayService.js
│   │   ├── leaveService.js
│   │   ├── documentService.js
│   │   └── dashboardService.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── parentRoutes.js
│   │   ├── visitorRoutes.js
│   │   ├── noticeRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── holidayRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── navigationRoutes.js
│   │   └── index.js            # Route aggregator
│   ├── utils/
│   │   ├── ApiResponse.js      # Consistent response format
│   │   ├── ApiError.js         # Custom error class
│   │   └── asyncHandler.js     # Async try-catch wrapper
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── studentValidator.js
│   │   ├── visitorValidator.js
│   │   └── leaveValidator.js
│   └── server.js               # Express app entry point
├── seed/
│   └── seedData.js             # `npm run seed` — inserts all existing mock data
├── .env.example
├── .gitignore
└── package.json
```

---

### Phase 2: Express API Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with username/password → returns JWT + user |
| POST | `/api/auth/logout` | Invalidate token (client-side) |
| GET | `/api/auth/me` | Get current authenticated user |

#### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all (with `?search=`, `?class=`, `?page=`, `?sort=`) |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

#### Teachers, Parents, Users — Same CRUD pattern as Students

#### Visitors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visitors` | List all |
| POST | `/api/visitors` | Add visitor |
| PATCH | `/api/visitors/:id/checkout` | Check out visitor |
| DELETE | `/api/visitors/:id` | Delete visitor |

#### Notices, Events, Holidays — Standard CRUD

#### Leaves
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves` | List all leaves |
| POST | `/api/leaves` | Apply for leave |

#### Documents — Standard CRUD

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/:role` | Dashboard data (infoboxes, profile, notices, calendar) |

#### Navigation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/navigation/:role` | Sidebar menu items for a role |

---

### Phase 3: Frontend API Layer

#### [NEW] `src/services/api/` directory

```
src/services/api/
├── apiClient.ts          # Axios instance with base URL, interceptors, JWT header
├── authApi.ts            # login(), logout(), getMe()
├── studentApi.ts         # getAll(), getById(), create(), update(), delete()
├── teacherApi.ts
├── parentApi.ts
├── userApi.ts
├── visitorApi.ts         # getAll(), create(), checkout(), delete()
├── noticeApi.ts
├── eventApi.ts
├── holidayApi.ts
├── leaveApi.ts           # getAll(), apply()
├── documentApi.ts
├── dashboardApi.ts       # getDashboard(role)
└── navigationApi.ts      # getNavigation(role)
```

#### [NEW] `src/hooks/useApi.ts`
Generic data-fetching hook with loading, error, and data states.

#### [MODIFY] `src/services/authService.ts`
Replace `validateCredentials()` import with `authApi.login()` call. Store JWT in `sessionStorage`.

#### [MODIFY] `src/services/dataService.ts`
Replace all in-memory array operations with corresponding API calls from `src/services/api/`.

---

### Phase 4: Page Refactoring

Every page that currently reads from `dataService` or `mockData` constants will be updated:

| Page | Current Source | New Source |
|------|---------------|------------|
| [LoginPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/LoginPage.tsx) | `authService.login()` → `authCredentials.ts` | `authApi.login()` → MongoDB `users` |
| [StudentPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/StudentPage.tsx) | `MOCK_STUDENTS` constant | `studentApi.getAll()` |
| [TeacherPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/TeacherPage.tsx) | `dataService.getTeachers()` | `teacherApi.getAll()` |
| [ParentPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/ParentPage.tsx) | `dataService.getParents()` | `parentApi.getAll()` |
| [UserPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/UserPage.tsx) | `dataService.getUsers()` | `userApi.getAll()` |
| [VisitorPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/VisitorPage.tsx) | `dataService.getVisitors/add/checkout/delete` | `visitorApi.*` |
| [NoticePage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/NoticePage.tsx) | `dataService.getNotices()` | `noticeApi.getAll()` |
| [EventPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/EventPage.tsx) | `dataService.getEvents()` | `eventApi.getAll()` |
| [HolidayPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/HolidayPage.tsx) | `dataService.getHolidays()` | `holidayApi.getAll()` |
| [LeaveApplyPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/LeaveApplyPage.tsx) | `dataService.getLeaves/addLeave` | `leaveApi.*` |
| [DetailViewPage.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/DetailViewPage.tsx) | `MOCK_PROFILE_REGISTRY`, `DEFAULT_ATTENDANCE`, `MOCK_DOCUMENTS` | `userApi.getProfile()`, `attendanceApi.*`, `documentApi.*` |
| [LibrarianDashboard.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/LibrarianDashboard.tsx) | `librarianDashboardData.ts` constants | `dashboardApi.getDashboard("Librarian")` |
| [ReceptionistDashboard.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/pages/ReceptionistDashboard.tsx) | `receptionistDashboardData.ts` constants | `dashboardApi.getDashboard("Receptionist")` |
| [DashboardLayout.tsx](file:///c:/Users/PARVEJ%20ALAM/Desktop/Internship/src/components/layout/DashboardLayout.tsx) | `getSidebarMenuItems()` from `navigation.ts` | `navigationApi.getNavigation(role)` |

---

### Phase 5: Loading & Error States

#### [NEW] `src/components/ui/Spinner.tsx`
Reusable loading spinner component shown while API calls are in progress.

#### [NEW] `src/components/ui/ErrorMessage.tsx`
Reusable error display component for API failures (404, 500, network errors).

Every page that fetches data will show:
- **Spinner** while loading
- **ErrorMessage** on failure
- **Data** on success

---

## Open Questions

> [!IMPORTANT]
> **MongoDB Connection**: Do you already have MongoDB installed locally, or should I use MongoDB Atlas (cloud)? I'll default to `mongodb://localhost:27017/school_management` in the `.env.example` — you can change it to an Atlas URI.

> [!IMPORTANT]
> **Password Hashing**: The current system stores passwords in plaintext (`123456`). The new backend will use **bcrypt** to hash passwords. The seed script will hash them automatically. Is this acceptable?

> [!IMPORTANT]
> **JWT Expiry**: I'll set JWT tokens to expire in **24 hours** by default. Should this be different?

---

## Verification Plan

### Automated Tests
```bash
# Start MongoDB
mongod

# Seed database with existing mock data
cd backend && npm run seed

# Start backend server
npm run dev

# In another terminal, start frontend
cd .. && npm run dev
```

### Manual Verification
1. **Login** with each of the 7 demo credentials → verify correct role dashboard loads
2. **Navigate** each sidebar menu → verify all pages load with data from MongoDB
3. **Student/Teacher/Parent/User pages** → verify table data matches seed data
4. **Visitor page** → add visitor, checkout, delete → verify persistence across page refreshes
5. **Leave Apply** → submit new leave → verify it appears in the list after refresh
6. **Notice/Event/Holiday pages** → verify data loads and modal details work
7. **Detail View** → verify profile, attendance grid, and documents tab all load
8. **Dashboard** → verify InfoBox counts are dynamically computed from actual DB counts
9. **Logout** → verify session is cleared and redirect to login works

### Build Verification
```bash
# Frontend build
npm run build
npm run lint

# Backend — no TypeScript compilation needed (plain JS)
```
