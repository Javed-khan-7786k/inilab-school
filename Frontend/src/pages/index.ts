/**
 * Centralized Barrel Export File for Pages Directory
 * Exports all pages categorized cleanly into feature module subfolders.
 */

// 1. Academic Module
export * from "./academic/AcademicClassPage";
export * from "./academic/AddClassPage";
export * from "./academic/AcademicSectionPage";
export * from "./academic/AddSectionPage";
export * from "./academic/AcademicSubjectPage";
export * from "./academic/AddSubjectPage";
export * from "./academic/AcademicSyllabusPage";
export * from "./academic/AddSyllabusPage";
export * from "./academic/AcademicAssignmentsPage";
export * from "./academic/AddAssignmentPage";
export * from "./academic/AcademicRoutinePage";
export * from "./academic/AddRoutinePage";

// 2. Exam Module
export * from "./exam/ExamExamPage";
export * from "./exam/AddExamPage";
export * from "./exam/ExamExamSchedulePage";
export * from "./exam/AddExamSchedulePage";
export * from "./exam/ExamGradePage";
export * from "./exam/AddGradePage";
export * from "./exam/ExamExamAttendancePage";
export * from "./exam/AddExamAttendancePage";

// 3. Mark Module
export * from "./mark/MarkMarkPage";
export * from "./mark/AddMarkPage";
export * from "./mark/MarkMarkDistributionPage";
export * from "./mark/AddMarkDistributionPage";
export * from "./mark/MarkPromotionPage";

// 4. Attendance Module
export * from "./attendance/StudentAttendancePage";
export * from "./attendance/StaffAttendancePage";
export * from "./attendance/TeacherAttendancePage";
export * from "./attendance/UserAttendancePage";
export * from "./attendance/AttendanceStudentAttendancePage";
export * from "./attendance/AttendanceStaffAttendancePage";
export { AttendenceViewPage } from "./attendance/AttendenceDashboard";

// 5. Users & Staff Management Module
export * from "./users/StudentPage";
export * from "./users/TeacherPage";
export * from "./users/AddTeacherPage";
export * from "./users/ParentPage";
export * from "./users/ParentsPage";
export * from "./users/StaffPage";
export * from "./users/UserPage";
export * from "./users/VisitorPage";

// 6. Announcements & Communication Module
export * from "./announcements/NoticePage";
export * from "./announcements/AnnouncementNoticePage";
export * from "./announcements/EventPage";
export * from "./announcements/AnnouncementEventsPage";
export * from "./announcements/HolidayPage";
export * from "./announcements/AnnouncementHolidayPage";
export * from "./announcements/MessagePage";
export * from "./announcements/MediaPage";
export * from "./announcements/MailSMSPage";
export * from "./announcements/AddMailSMSPage";

// 7. Enquiry & Admission Module
export * from "./enquiry/CurrentEnquiriesPage";
export * from "./enquiry/EnquiryFormPage";
export * from "./enquiry/EnquiryListPage";
export * from "./enquiry/OnlineAdmissionPage";

// 8. Dashboard & Core Module
export * from "./dashboard/AdminDashboard";
export * from "./dashboard/ReceptionistDashboard";
export * from "./dashboard/LibrarianDashboard";
export * from "./dashboard/DefaultDashboard";
export * from "./dashboard/DashboardPage";
export * from "./dashboard/DashboardDispatcher";
export * from "./LoginPage";
export * from "./DetailViewPage";
export * from "./TutorialPage";
export * from "./GmeetliveclassPage";

// 9. Accounts & Financial Module
export * from "./accounts/AccountExpensePage";
export * from "./accounts/AccountFeeTypesPage";
export * from "./accounts/AccountGlobalPaymentPage";
export * from "./accounts/AccountIncomePage";
export * from "./accounts/AccountInvoicePage";
export * from "./accounts/AccountPaymentHistoryPage";

// 10. Administrator & System Module
export * from "./administrator/AdministratorAcademicYearPage";
export * from "./administrator/AdministratorAutoLogoutPage";
export * from "./administrator/AdministratorBackupPage";
export * from "./administrator/AdministratorComplaintPage";
export * from "./administrator/AdministratorImportPage";
export * from "./administrator/AdministratorMailLogPage";
export * from "./administrator/AdministratorMakeLoginTemplatesPage";
export * from "./administrator/AdministratorPasscodePage";
export * from "./administrator/AdministratorPurchaseTemplatePage";
export * from "./administrator/AdministratorResetAdminPage";
export * from "./administrator/AdministratorStudentGroupPage";

// 11. Reports Module
export * from "./reports/ReportAcademicPaymentFeesReportPage";
export * from "./reports/ReportAccountLedgerReportPage";
export * from "./reports/ReportAdmitCardReportPage";
export * from "./reports/ReportAttendanceOverviewReportPage";
export * from "./reports/ReportAttendanceReportPage";
export * from "./reports/ReportBalanceFeesReportPage";
export * from "./reports/ReportCertificateReportPage";
export * from "./reports/ReportClassReportPage";
export * from "./reports/ReportDueFeesReportPage";
export * from "./reports/ReportExamScheduleReportPage";
export * from "./reports/ReportFeesReportPage";
export * from "./reports/ReportIDCardReportPage";
export * from "./reports/ReportLeaveApplicationReportPage";
export * from "./reports/ReportLibraryBookIssueReportPage";
export * from "./reports/ReportLibraryBooksReportPage";
export * from "./reports/ReportLibraryCardReportPage";
export * from "./reports/ReportMarkSheetReportPage";
export * from "./reports/ReportMarkUsageReportPage";
export * from "./reports/ReportOnlineAdmissionReportPage";
export * from "./reports/ReportOnlineExamQuestionAnswersReportPage";
export * from "./reports/ReportOnlineExamQuestionReportPage";
export * from "./reports/ReportOnlineExamReportPage";
export * from "./reports/ReportOverviewReportPage";
export * from "./reports/ReportPersonalReportPage";
export * from "./reports/ReportProductPurchaseReportPage";
export * from "./reports/ReportProductSaleReportPage";
export * from "./reports/ReportProgressCardReportPage";
export * from "./reports/ReportRoutineReportPage";
export * from "./reports/ReportSalaryReportPage";
export * from "./reports/ReportSponsorshipReportPage";
export * from "./reports/ReportStudentReportPage";
export * from "./reports/ReportStudentsFineReportPage";
export * from "./reports/ReportTabulationSheetReportPage";
export * from "./reports/ReportTeacherGenderReportPage";
export * from "./reports/ReportTransactionReportPage";

// 12. Settings Module
export * from "./settings/SchoolSettingsPage";
export * from "./settings/UsersPermissionPage";
export * from "./settings/MessageMailPage";
export * from "./settings/ProductLicensePage";
export * from "./settings/SettingsMainPage";
export * from "./settings/SettingsEmailSettingPage";
export * from "./settings/SettingsFinancialSettingsPage";
export * from "./settings/SettingsGeneralSettingPage";
export * from "./settings/SettingsMockSettingPage";
export * from "./settings/SettingsPaymentSettingsPage";
export * from "./settings/SettingsSMSSettingsPage";

// 13. Other Feature Subsystems
export * from "./asset/AssetManagementAssetAssignmentsPage";
export * from "./asset/AssetManagementAssetCategoryPage";
export * from "./asset/AssetManagementAssetPage";
export * from "./asset/AssetManagementLocationPage";
export * from "./asset/AssetManagementPurchasePage";
export * from "./asset/AssetManagementVendorPage";

export * from "./child/ChildActivitiesCategoryPage";
export * from "./child/ChildActivitiesPage";
export * from "./child/ChildChildCarePage";

export * from "./hostel/HostelCategoryPage";
export * from "./hostel/HostelHostelPage";
export * from "./hostel/HostelMemberPage";

export * from "./inventory/InventoryCategoryPage";
export * from "./inventory/InventoryProductPage";
export * from "./inventory/InventoryPurchasePage";
export * from "./inventory/InventorySalePage";
export * from "./inventory/InventorySupplierPage";
export * from "./inventory/InventoryWarehousePage";

export * from "./leave/LeaveApplicationLeaveApplicationPage";
export * from "./leave/LeaveApplicationLeaveApplyPage";
export * from "./leave/LeaveApplicationLeaveAssignPage";
export * from "./leave/LeaveApplicationLeaveCategoryPage";
export * from "./leave/LeaveApplyPage";

export * from "./library/LibraryBooksPage";
export * from "./library/LibraryEBooksPage";
export * from "./library/LibraryIssuePage";
export * from "./library/LibraryMemberPage";

export * from "./onlineExam/OnlineExamInstructionPage";
export * from "./onlineExam/AddInstructionPage";
export * from "./onlineExam/OnlineExamOnlineExamPage";
export * from "./onlineExam/AddOnlineExamPage";
export * from "./onlineExam/OnlineExamQuestionBankPage";
export * from "./onlineExam/AddQuestionBankPage";
export * from "./onlineExam/OnlineExamQuestionGroupPage";
export * from "./onlineExam/AddQuestionGroupPage";
export * from "./onlineExam/OnlineExamQuestionLevelPage";
export * from "./onlineExam/AddQuestionLevelPage";
export * from "./onlineExam/OnlineExamTakeExamPage";
export * from "./onlineExam/AddTakeExamPage";

export * from "./payroll/PayrollHourlyTemplatePage";
export * from "./payroll/AddHourlyTemplatePage";
export * from "./payroll/PayrollMakePaymentsPage";
export * from "./payroll/PayrollManageSalaryPage";
export * from "./payroll/PayrollOvertimePage";
export * from "./payroll/AddOvertimePage";
export * from "./payroll/PayrollSalaryTemplatePage";
export * from "./payroll/AddSalaryTemplatePage";

export * from "./sponsorship/SponsorshipCandidatePage";
export * from "./sponsorship/SponsorshipSponsorPage";
export * from "./sponsorship/SponsorshipSponsorshipPage";

export * from "./transport/TransportMemberPage";
export * from "./transport/TransportTransportPage";

export * from "./frontend/FrontendLibraryFrontendPage";
export * from "./frontend/FrontendPagesPage";
export * from "./frontend/FrontendTakeExamFrontendPage";
export * from "./frontend/FrontendVisitorCommentsPage";
export * from "./common/UnderConstructionPage";
