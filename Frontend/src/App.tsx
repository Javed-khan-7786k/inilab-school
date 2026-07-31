import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardDispatcher } from "./pages/DashboardDispatcher";
import { LanguageProvider } from "./context/LanguageContext";
import { StudentPage } from "./pages/StudentPage";
import { TeacherPage } from "./pages/TeacherPage";
import { AddTeacherPage } from "./pages/AddTeacherPage";
import { ParentPage } from "./pages/ParentPage";
import { UserPage } from "./pages/UserPage";
import { StudentAttendancePage } from "./pages/StudentAttendancePage";
import { TeacherAttendancePage } from "./pages/TeacherAttendancePage";
import { UserAttendancePage } from "./pages/UserAttendancePage";
import { DetailViewPage } from "./pages/DetailViewPage";
import { MessagePage } from "./pages/MessagePage";
import { MediaPage } from "./pages/MediaPage";
import { LeaveApplyPage } from "./pages/LeaveApplyPage";
import { NoticePage } from "./pages/NoticePage";
import { EventPage } from "./pages/EventPage";
import { HolidayPage } from "./pages/HolidayPage";
import { VisitorPage } from "./pages/VisitorPage";
import { EnquiryFormPage } from "./pages/EnquiryFormPage";
import { EnquiryListPage } from "./pages/EnquiryListPage";
import { AttendenceViewPage } from "./pages/AttendenceDashboard";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected route for all roles */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute>
                <TeacherPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/teacher/add"
            element={
              <ProtectedRoute>
                <AddTeacherPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/teacher/edit/:id"
            element={
              <ProtectedRoute>
                <AddTeacherPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/parents"
            element={
              <ProtectedRoute>
                <ParentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/attendance/student"
            element={
              <ProtectedRoute>
                <StudentAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/attendance/teacher"
            element={
              <ProtectedRoute>
                <TeacherAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/attendance/user"
            element={
              <ProtectedRoute>
                <UserAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/view/:type/:id"
            element={
              <ProtectedRoute>
                <DetailViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/view/:type/Attendence/:id"
            element={
              <ProtectedRoute>
                <AttendenceViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/message"
            element={
              <ProtectedRoute>
                <MessagePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/media"
            element={
              <ProtectedRoute>
                <MediaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/leave-apply"
            element={
              <ProtectedRoute>
                <LeaveApplyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/announcement/notice"
            element={
              <ProtectedRoute>
                <NoticePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/announcement/event"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/announcement/holiday"
            element={
              <ProtectedRoute>
                <HolidayPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/visitor"
            element={
              <ProtectedRoute>
                <VisitorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/enquiry/new"
            element={
              <ProtectedRoute>
                <EnquiryFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/enquiry/edit/:id"
            element={
              <ProtectedRoute>
                <EnquiryFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/enquiry/current"
            element={
              <ProtectedRoute>
                <EnquiryListPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
