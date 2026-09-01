import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";
import {
  LoginPage,
  DashboardDispatcher,
  StudentPage,
  StaffPage,
  AddTeacherPage,
  ParentPage,
  StudentAttendancePage,
  TeacherAttendancePage,
  UserAttendancePage,
  DetailViewPage,
  MessagePage,
  MediaPage,
  LeaveApplyPage,
  NoticePage,
  EventPage,
  HolidayPage,
  MailSMSPage,
  VisitorPage,
  EnquiryFormPage,
  EnquiryListPage,
  AttendenceViewPage,
  AcademicClassPage,
  AddClassPage,
  AcademicSectionPage,
  AddSectionPage,
  AcademicSubjectPage,
  AddSubjectPage,
  AcademicSyllabusPage,
  AddSyllabusPage,
  AcademicAssignmentsPage,
  AddAssignmentPage,
  AcademicRoutinePage,
  AddRoutinePage,
  ExamExamPage,
  AddExamPage,
  ExamExamSchedulePage,
  AddExamSchedulePage,
  ExamGradePage,
  AddGradePage,
  ExamExamAttendancePage,
  AddExamAttendancePage,
  ExamAdmitCardPage,
  MarkMarkPage,
  AddMarkPage,
  MarkMarkDistributionPage,
  AddMarkDistributionPage,
  MarkPromotionPage,
  AddMailSMSPage,
  OnlineExamQuestionGroupPage,
  AddQuestionGroupPage,
  OnlineExamQuestionLevelPage,
  AddQuestionLevelPage,
  OnlineExamQuestionBankPage,
  AddQuestionBankPage,
  OnlineExamOnlineExamPage,
  AddOnlineExamPage,
  OnlineExamInstructionPage,
  AddInstructionPage,
  OnlineExamTakeExamPage,
  AddTakeExamPage,
  PayrollSalaryTemplatePage,
  AddSalaryTemplatePage,
  PayrollHourlyTemplatePage,
  AddHourlyTemplatePage,
  PayrollManageSalaryPage,
  PayrollMakePaymentsPage,
  PayrollOvertimePage,
  AddOvertimePage,
  UnderConstructionPage,
  SchoolSettingsPage,
  UsersPermissionPage,
  MessageMailPage,
  ProductLicensePage,
  SettingsMainPage,
  
} from "./pages";
import FeeDashboard from "./pages/fee/FeeDashboard";
import FeeViewPage from "./pages/fee/FeeViewPage";

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
            path="/dashboard/staff"
            element={
              <ProtectedRoute>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute>
                <StaffPage />
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
                <StaffPage />
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
            path="/dashboard/mail-sms"
            element={
              <ProtectedRoute>
                <MailSMSPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/announcement/mail-sms"
            element={
              <ProtectedRoute>
                <MailSMSPage />
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

          <Route
            path="/dashboard/academic/class"
            element={
              <ProtectedRoute>
                <AcademicClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/class/add"
            element={
              <ProtectedRoute>
                <AddClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/class/edit/:id"
            element={
              <ProtectedRoute>
                <AddClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/section"
            element={
              <ProtectedRoute>
                <AcademicSectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/section/add"
            element={
              <ProtectedRoute>
                <AddSectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/section/edit/:id"
            element={
              <ProtectedRoute>
                <AddSectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/subject"
            element={
              <ProtectedRoute>
                <AcademicSubjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/subject/add"
            element={
              <ProtectedRoute>
                <AddSubjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/subject/edit/:id"
            element={
              <ProtectedRoute>
                <AddSubjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/syllabus"
            element={
              <ProtectedRoute>
                <AcademicSyllabusPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/syllabus/add"
            element={
              <ProtectedRoute>
                <AddSyllabusPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/syllabus/edit/:id"
            element={
              <ProtectedRoute>
                <AddSyllabusPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignments"
            element={
              <ProtectedRoute>
                <AcademicAssignmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignment"
            element={
              <ProtectedRoute>
                <AcademicAssignmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignment/add"
            element={
              <ProtectedRoute>
                <AddAssignmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignments/add"
            element={
              <ProtectedRoute>
                <AddAssignmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignment/edit/:id"
            element={
              <ProtectedRoute>
                <AddAssignmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/assignments/edit/:id"
            element={
              <ProtectedRoute>
                <AddAssignmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/routine"
            element={
              <ProtectedRoute>
                <AcademicRoutinePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/routine/add"
            element={
              <ProtectedRoute>
                <AddRoutinePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/academic/routine/edit/:id"
            element={
              <ProtectedRoute>
                <AddRoutinePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam"
            element={
              <ProtectedRoute>
                <ExamExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/add"
            element={
              <ProtectedRoute>
                <AddExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/edit/:id"
            element={
              <ProtectedRoute>
                <AddExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/schedule"
            element={
              <ProtectedRoute>
                <ExamExamSchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/schedule/add"
            element={
              <ProtectedRoute>
                <AddExamSchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/schedule/edit/:id"
            element={
              <ProtectedRoute>
                <AddExamSchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/grade"
            element={
              <ProtectedRoute>
                <ExamGradePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/grade/add"
            element={
              <ProtectedRoute>
                <AddGradePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/grade/edit/:id"
            element={
              <ProtectedRoute>
                <AddGradePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/attendance"
            element={
              <ProtectedRoute>
                <ExamExamAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/attendance/add"
            element={
              <ProtectedRoute>
                <AddExamAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/exam/admit-card"
            element={
              <ProtectedRoute>
                <ExamAdmitCardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark"
            element={
              <ProtectedRoute>
                <MarkMarkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/add"
            element={
              <ProtectedRoute>
                <AddMarkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/edit/:id"
            element={
              <ProtectedRoute>
                <AddMarkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/distribution"
            element={
              <ProtectedRoute>
                <MarkMarkDistributionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/distribution/add"
            element={
              <ProtectedRoute>
                <AddMarkDistributionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/distribution/edit/:id"
            element={
              <ProtectedRoute>
                <AddMarkDistributionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/mark/promotion"
            element={
              <ProtectedRoute>
                <MarkPromotionPage />
              </ProtectedRoute>
            }
          />

          {/* Mail / SMS Routes */}
          <Route
            path="/dashboard/mail-sms"
            element={
              <ProtectedRoute>
                <MailSMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/mail-sms/add"
            element={
              <ProtectedRoute>
                <AddMailSMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/mail-sms/edit/:id"
            element={
              <ProtectedRoute>
                <AddMailSMSPage />
              </ProtectedRoute>
            }
          />

          {/* Online Exam Modules Routes */}
          <Route
            path="/dashboard/online-exam/question-group"
            element={
              <ProtectedRoute>
                <OnlineExamQuestionGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-group/add"
            element={
              <ProtectedRoute>
                <AddQuestionGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-group/edit/:id"
            element={
              <ProtectedRoute>
                <AddQuestionGroupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam/question-level"
            element={
              <ProtectedRoute>
                <OnlineExamQuestionLevelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-level/add"
            element={
              <ProtectedRoute>
                <AddQuestionLevelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-level/edit/:id"
            element={
              <ProtectedRoute>
                <AddQuestionLevelPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam/question-bank"
            element={
              <ProtectedRoute>
                <OnlineExamQuestionBankPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-bank/add"
            element={
              <ProtectedRoute>
                <AddQuestionBankPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/question-bank/edit/:id"
            element={
              <ProtectedRoute>
                <AddQuestionBankPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam"
            element={
              <ProtectedRoute>
                <OnlineExamOnlineExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/add"
            element={
              <ProtectedRoute>
                <AddOnlineExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/edit/:id"
            element={
              <ProtectedRoute>
                <AddOnlineExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam/online-exam"
            element={
              <ProtectedRoute>
                <OnlineExamOnlineExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/online-exam/add"
            element={
              <ProtectedRoute>
                <AddOnlineExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/online-exam/edit/:id"
            element={
              <ProtectedRoute>
                <AddOnlineExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam/instruction"
            element={
              <ProtectedRoute>
                <OnlineExamInstructionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/instruction/add"
            element={
              <ProtectedRoute>
                <AddInstructionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/instruction/edit/:id"
            element={
              <ProtectedRoute>
                <AddInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/online-exam/take-exam"
            element={
              <ProtectedRoute>
                <OnlineExamTakeExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/online-exam/take-exam/add"
            element={
              <ProtectedRoute>
                <AddTakeExamPage />
              </ProtectedRoute>
            }
          />
          {/* Payroll Routes */}
          <Route
            path="/dashboard/payroll/salary-template"
            element={
              <ProtectedRoute>
                <PayrollSalaryTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/salary-template/add"
            element={
              <ProtectedRoute>
                <AddSalaryTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/hourly-template"
            element={
              <ProtectedRoute>
                <PayrollHourlyTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/hourly-template/add"
            element={
              <ProtectedRoute>
                <AddHourlyTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/manage-salary"
            element={
              <ProtectedRoute>
                <PayrollManageSalaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/make-payment"
            element={
              <ProtectedRoute>
                <PayrollMakePaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/overtime"
            element={
              <ProtectedRoute>
                <PayrollOvertimePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/overtime/add"
            element={
              <ProtectedRoute>
                <AddOvertimePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll/overtime/edit/:id"
            element={
              <ProtectedRoute>
                <AddOvertimePage />
              </ProtectedRoute>
            }
          />

          {/* Settings Routes */}
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsMainPage defaultModule="school" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/school"
            element={
              <ProtectedRoute>
                <SchoolSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/users-permission"
            element={
              <ProtectedRoute>
                <UsersPermissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/message-mail"
            element={
              <ProtectedRoute>
                <MessageMailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/product-license"
            element={
              <ProtectedRoute>
                <ProductLicensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/general"
            element={
              <ProtectedRoute>
                <SchoolSettingsPage initialTab="profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/sms"
            element={
              <ProtectedRoute>
                <MessageMailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings/email"
            element={
              <ProtectedRoute>
                <MessageMailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fee"
            element={
              <ProtectedRoute>
                <FeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fee/view/:id"
            element={
              <ProtectedRoute>
                <FeeViewPage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Under Construction Fallback Route */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <UnderConstructionPage />
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