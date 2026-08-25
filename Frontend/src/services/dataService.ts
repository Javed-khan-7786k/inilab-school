import { studentApi } from "./api/studentApi";
import { teacherApi } from "./api/teacherApi";
import { parentApi } from "./api/parentApi";
import { visitorApi } from "./api/visitorApi";
import { noticeApi } from "./api/noticeApi";
import { eventApi } from "./api/eventApi";
import { holidayApi } from "./api/holidayApi";
import { leaveApi } from "./api/leaveApi";
import { documentApi } from "./api/documentApi";
import { userApi } from "./api/userApi";
import { enquiryApi } from "./api/enquiryApi";
import { classApi } from "./api/classApi";
import { sectionApi } from "./api/sectionApi";
import { subjectApi } from "./api/subjectApi";
import { syllabusApi } from "./api/syllabusApi";
import { assignmentApi } from "./api/assignmentApi";
import { routineApi } from "./api/routineApi";
import { examApi } from "./api/examApi";
import { examScheduleApi } from "./api/examScheduleApi";
import { gradeApi } from "./api/gradeApi";
import { examAttendanceApi } from "./api/examAttendanceApi";
import { markApi } from "./api/markApi";
import { markDistributionApi } from "./api/markDistributionApi";
import { promotionApi } from "./api/promotionApi";
import { mailSmsApi } from "./api/mailSmsApi";
import { questionGroupApi } from "./api/questionGroupApi";
import { questionLevelApi } from "./api/questionLevelApi";
import { questionBankApi } from "./api/questionBankApi";
import { onlineExamApi } from "./api/onlineExamApi";
import { instructionApi } from "./api/instructionApi";
import { takeExamApi } from "./api/takeExamApi";
import { salaryTemplateApi } from "./api/salaryTemplateApi";
import { hourlyTemplateApi } from "./api/hourlyTemplateApi";
import { overtimeApi } from "./api/overtimeApi";

import type {
  Student,
  Teacher,
  Parent,
  Visitor,
  NoticeItem,
  MailSMSItem,
  QuestionGroupItem,
  QuestionLevelItem,
  QuestionBankItem,
  OnlineExamItem,
  InstructionItem,
  TakeExamItem,
  SalaryTemplateItem,
  HourlyTemplateItem,
  OvertimeItem,
  EventItem,
  HolidayItem,
  LeaveApplication,
  DocumentItem,
  UserItem,
  Enquiry,
  StudentListItem,
  StaffListItem,
  ClassItem,
  SectionItem,
  SubjectItem,
  SyllabusItem,
  AssignmentItem,
  RoutineItem,
  ExamItem,
  ExamScheduleItem,
  GradeItem,
  ExamAttendanceItem,
  MarkItem,
  MarkDistributionItem,
  PromotionSettingItem
} from "../types";

import { MOCK_STUDENTS } from "../constants/mockData";

export const dataService = {
  // Students
  async getStudents(): Promise<Student[]> {
    try {
      const data = await studentApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Failed to fetch students from DB API, using fallback test mock data:", err);
    }
    return MOCK_STUDENTS;
  },

  // Admin Student page: ONLY real admitted students (no pending enquiries)
  async getAdmittedStudents(): Promise<StudentListItem[]> {
    const students = await studentApi.getAll();
    return students.map((s) => ({
      id: `student-${s.id}`,
      rawId: s.id,
      photo: s.photo,
      name: s.name,
      roll: s.roll,
      email: s.email,
      className: s.className,
      status: 'Admitted',
      source: 'student',
    }));
  },

  // Admin Student page: Admitted students + Not-yet-admitted enquiries, merged
  async getStudentsAndEnquiries(): Promise<StudentListItem[]> {
    const [students, enquiries] = await Promise.all([
      studentApi.getAll(),
      enquiryApi.getAll(),
    ]);

    const studentItems: StudentListItem[] = students.map((s) => ({
      id: `student-${s.id}`,
      rawId: s.id,
      photo: s.photo,
      name: s.name,
      roll: s.roll,
      email: s.email,
      className: s.className,
      status: 'Admitted',
      source: 'student',
    }));

    const enquiryItems: StudentListItem[] = enquiries.map((e) => ({
      id: `enquiry-${e.id}`,
      rawId: e.id,
      photo: e.photo || 'https://demo.eduking.xyz/uploads/images/default.png',
      name: e.studentName,
      roll: '-',
      email: e.fatherEmail || e.motherEmail || '',
      className: e.applyingClass,
      status: e.status,
      source: 'enquiry',
    }));

    return [...studentItems, ...enquiryItems];
  },

  async deleteStudent(id: string | number): Promise<void> {
    await studentApi.delete(id);
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return teacherApi.getAll();
  },

  // Parents
  async getParents(): Promise<Parent[]> {
    return parentApi.getAll();
  },

  // Visitors
  async getVisitors(): Promise<Visitor[]> {
    return visitorApi.getAll();
  },
  async addVisitor(name: string, toMeet: string, status: 'in' | 'out'): Promise<Visitor> {
    return visitorApi.create(name, toMeet, status);
  },
  async checkoutVisitor(id: string | number): Promise<Visitor> {
    return visitorApi.checkout(id);
  },
  async deleteVisitor(id: string | number): Promise<void> {
    await visitorApi.delete(id);
  },

  // Notices
  async getNotices(): Promise<NoticeItem[]> {
    return noticeApi.getAll();
  },
  async addNotice(data: Omit<NoticeItem, "id">): Promise<NoticeItem> {
    return noticeApi.create(data);
  },
  async updateNotice(id: string | number, data: Partial<NoticeItem>): Promise<NoticeItem> {
    return noticeApi.update(id, data);
  },
  async deleteNotice(id: string | number): Promise<void> {
    await noticeApi.delete(id);
  },

  // Events
  async getEvents(): Promise<EventItem[]> {
    return eventApi.getAll();
  },
  async addEvent(data: Omit<EventItem, "id">): Promise<EventItem> {
    return eventApi.create(data);
  },
  async updateEvent(id: string | number, data: Partial<EventItem>): Promise<EventItem> {
    return eventApi.update(id, data);
  },
  async deleteEvent(id: string | number): Promise<void> {
    await eventApi.delete(id);
  },

  // Holidays
  async getHolidays(): Promise<HolidayItem[]> {
    return holidayApi.getAll();
  },

  // Leave Applications
  async getLeaves(): Promise<LeaveApplication[]> {
    return leaveApi.getAll();
  },
  async addLeave(applyTo: string, category: string, schedule: string, daysCount: number): Promise<LeaveApplication> {
    return leaveApi.apply(applyTo, category, schedule, daysCount);
  },

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    return documentApi.getAll();
  },

  // Users
  async getUsers(): Promise<UserItem[]> {
    return userApi.getAll();
  },

  // Staff (Unified Teachers + Users)
  async getStaffMembers(): Promise<StaffListItem[]> {
    const [teachers, users] = await Promise.all([
      teacherApi.getAll(),
      userApi.getAll(),
    ]);

    const teacherItems: StaffListItem[] = teachers.map((t) => ({
      id: `teacher-${t.id}`,
      rawId: t.id,
      photo: t.photo || 'https://demo.eduking.xyz/uploads/images/default.png',
      name: t.name,
      email: t.email,
      role: 'Teacher',
      designation: t.designation || 'Teacher',
      type: 'teacher',
      status: 'Active',
    }));

    const userItems: StaffListItem[] = users.map((u) => ({
      id: `user-${u.id}`,
      rawId: u.id,
      photo: u.photo || 'https://demo.eduking.xyz/uploads/images/default.png',
      name: u.name,
      email: u.email,
      role: u.role || 'Staff',
      designation: u.role || 'Staff',
      type: 'user',
      status: 'Active',
    }));

    return [...teacherItems, ...userItems];
  },

  async deleteStaffMember(rawId: string | number, type: 'teacher' | 'user'): Promise<void> {
    if (type === 'teacher') {
      await teacherApi.delete(rawId);
    } else {
      await userApi.delete(rawId);
    }
  },

  // Enquiries
  async getEnquiries(params?: any): Promise<Enquiry[]> {
    return enquiryApi.getAll(params);
  },
  async getEnquiryById(id: string | number): Promise<Enquiry> {
    return enquiryApi.getById(id);
  },
  async addEnquiry(data: Omit<Enquiry, "id">): Promise<Enquiry> {
    return enquiryApi.create(data);
  },
  async updateEnquiry(id: string | number, data: Partial<Enquiry>): Promise<Enquiry> {
    return enquiryApi.update(id, data);
  },
  async deleteEnquiry(id: string | number): Promise<void> {
    await enquiryApi.delete(id);
  },

  // Classes
  async getClasses(): Promise<ClassItem[]> {
    return classApi.getAll();
  },
  async getClassById(id: string | number): Promise<ClassItem> {
    return classApi.getById(id);
  },
  async addClass(data: Omit<ClassItem, "id">): Promise<ClassItem> {
    return classApi.create(data);
  },
  async updateClass(id: string | number, data: Partial<ClassItem>): Promise<ClassItem> {
    return classApi.update(id, data);
  },
  async deleteClass(id: string | number): Promise<void> {
    await classApi.delete(id);
  },

  // Sections
  async getSections(params?: { className?: string }): Promise<SectionItem[]> {
    return sectionApi.getAll(params);
  },
  async getSectionById(id: string | number): Promise<SectionItem> {
    return sectionApi.getById(id);
  },
  async addSection(data: Omit<SectionItem, "id">): Promise<SectionItem> {
    return sectionApi.create(data);
  },
  async updateSection(id: string | number, data: Partial<SectionItem>): Promise<SectionItem> {
    return sectionApi.update(id, data);
  },
  async deleteSection(id: string | number): Promise<void> {
    await sectionApi.delete(id);
  },

  // Subjects
  async getSubjects(params?: { className?: string }): Promise<SubjectItem[]> {
    return subjectApi.getAll(params);
  },
  async getSubjectById(id: string | number): Promise<SubjectItem> {
    return subjectApi.getById(id);
  },
  async addSubject(data: Omit<SubjectItem, "id">): Promise<SubjectItem> {
    return subjectApi.create(data);
  },
  async updateSubject(id: string | number, data: Partial<SubjectItem>): Promise<SubjectItem> {
    return subjectApi.update(id, data);
  },
  async deleteSubject(id: string | number): Promise<void> {
    await subjectApi.delete(id);
  },

  // Syllabuses
  async getSyllabuses(params?: { className?: string }): Promise<SyllabusItem[]> {
    return syllabusApi.getAll(params);
  },
  async getSyllabusById(id: string | number): Promise<SyllabusItem> {
    return syllabusApi.getById(id);
  },
  async addSyllabus(data: Omit<SyllabusItem, "id">): Promise<SyllabusItem> {
    return syllabusApi.create(data);
  },
  async updateSyllabus(id: string | number, data: Partial<SyllabusItem>): Promise<SyllabusItem> {
    return syllabusApi.update(id, data);
  },
  async deleteSyllabus(id: string | number): Promise<void> {
    await syllabusApi.delete(id);
  },

  // Assignments
  async getAssignments(params?: { className?: string }): Promise<AssignmentItem[]> {
    return assignmentApi.getAll(params);
  },
  async getAssignmentById(id: string | number): Promise<AssignmentItem> {
    return assignmentApi.getById(id);
  },
  async addAssignment(data: Omit<AssignmentItem, "id">): Promise<AssignmentItem> {
    return assignmentApi.create(data);
  },
  async updateAssignment(id: string | number, data: Partial<AssignmentItem>): Promise<AssignmentItem> {
    return assignmentApi.update(id, data);
  },
  async deleteAssignment(id: string | number): Promise<void> {
    await assignmentApi.delete(id);
  },

  // Routines
  async getRoutines(params?: { className?: string }): Promise<RoutineItem[]> {
    return routineApi.getAll(params);
  },
  async getRoutineById(id: string | number): Promise<RoutineItem> {
    return routineApi.getById(id);
  },
  async addRoutine(data: Omit<RoutineItem, "id">): Promise<RoutineItem> {
    return routineApi.create(data);
  },
  async updateRoutine(id: string | number, data: Partial<RoutineItem>): Promise<RoutineItem> {
    return routineApi.update(id, data);
  },
  async deleteRoutine(id: string | number): Promise<void> {
    await routineApi.delete(id);
  },

  // Exams
  async getExams(): Promise<ExamItem[]> {
    return examApi.getAll();
  },
  async getExamById(id: string | number): Promise<ExamItem> {
    return examApi.getById(id);
  },
  async addExam(data: Omit<ExamItem, "id">): Promise<ExamItem> {
    return examApi.create(data);
  },
  async updateExam(id: string | number, data: Partial<ExamItem>): Promise<ExamItem> {
    return examApi.update(id, data);
  },
  async deleteExam(id: string | number): Promise<void> {
    await examApi.delete(id);
  },

  // Exam Schedules
  async getExamSchedules(params?: { className?: string }): Promise<ExamScheduleItem[]> {
    return examScheduleApi.getAll(params);
  },
  async getExamScheduleById(id: string | number): Promise<ExamScheduleItem> {
    return examScheduleApi.getById(id);
  },
  async addExamSchedule(data: Omit<ExamScheduleItem, "id">): Promise<ExamScheduleItem> {
    return examScheduleApi.create(data);
  },
  async updateExamSchedule(id: string | number, data: Partial<ExamScheduleItem>): Promise<ExamScheduleItem> {
    return examScheduleApi.update(id, data);
  },
  async deleteExamSchedule(id: string | number): Promise<void> {
    await examScheduleApi.delete(id);
  },

  // Grades
  async getGrades(): Promise<GradeItem[]> {
    return gradeApi.getAll();
  },
  async getGradeById(id: string | number): Promise<GradeItem> {
    return gradeApi.getById(id);
  },
  async addGrade(data: Omit<GradeItem, "id">): Promise<GradeItem> {
    return gradeApi.create(data);
  },
  async updateGrade(id: string | number, data: Partial<GradeItem>): Promise<GradeItem> {
    return gradeApi.update(id, data);
  },
  async deleteGrade(id: string | number): Promise<void> {
    await gradeApi.delete(id);
  },

  // Exam Attendances
  async getExamAttendances(params?: { examName?: string; className?: string; sectionName?: string; subjectName?: string }): Promise<ExamAttendanceItem[]> {
    return examAttendanceApi.getAll(params);
  },
  async getExamAttendanceById(id: string | number): Promise<ExamAttendanceItem> {
    return examAttendanceApi.getById(id);
  },
  async saveExamAttendanceBulk(records: Partial<ExamAttendanceItem>[]): Promise<ExamAttendanceItem[]> {
    return examAttendanceApi.saveBulk(records);
  },
  async updateExamAttendance(id: string | number, data: Partial<ExamAttendanceItem>): Promise<ExamAttendanceItem> {
    return examAttendanceApi.update(id, data);
  },
  async deleteExamAttendance(id: string | number): Promise<void> {
    await examAttendanceApi.delete(id);
  },

  // Marks
  async getMarks(params?: { className?: string; examName?: string; sectionName?: string; subjectName?: string }): Promise<MarkItem[]> {
    return markApi.getAll(params);
  },
  async getMarkById(id: string | number): Promise<MarkItem> {
    return markApi.getById(id);
  },
  async saveMarksBulk(records: Partial<MarkItem>[]): Promise<MarkItem[]> {
    return markApi.saveBulk(records);
  },
  async updateMark(id: string | number, data: Partial<MarkItem>): Promise<MarkItem> {
    return markApi.update(id, data);
  },
  async deleteMark(id: string | number): Promise<void> {
    await markApi.delete(id);
  },

  // Mark Distributions
  async getMarkDistributions(): Promise<MarkDistributionItem[]> {
    return markDistributionApi.getAll();
  },
  async getMarkDistributionById(id: string | number): Promise<MarkDistributionItem> {
    return markDistributionApi.getById(id);
  },
  async addMarkDistribution(data: Partial<MarkDistributionItem>): Promise<MarkDistributionItem> {
    return markDistributionApi.create(data);
  },
  async updateMarkDistribution(id: string | number, data: Partial<MarkDistributionItem>): Promise<MarkDistributionItem> {
    return markDistributionApi.update(id, data);
  },
  async deleteMarkDistribution(id: string | number): Promise<void> {
    await markDistributionApi.delete(id);
  },

  // Promotions
  async getPromotionSetting(params?: { academicYear?: string; className?: string }): Promise<PromotionSettingItem> {
    return promotionApi.getSetting(params);
  },
  async savePromotionSetting(data: Partial<PromotionSettingItem>): Promise<PromotionSettingItem> {
    return promotionApi.saveSetting(data);
  },

  // Mail / SMS
  async getMailSMSList(): Promise<MailSMSItem[]> {
    return mailSmsApi.getAll();
  },
  async addMailSMS(data: Omit<MailSMSItem, "id">): Promise<MailSMSItem> {
    return mailSmsApi.create(data);
  },
  async deleteMailSMS(id: string | number): Promise<void> {
    await mailSmsApi.delete(id);
  },

  // Question Groups
  async getQuestionGroups(): Promise<QuestionGroupItem[]> {
    return questionGroupApi.getAll();
  },
  async addQuestionGroup(data: Omit<QuestionGroupItem, "id">): Promise<QuestionGroupItem> {
    return questionGroupApi.create(data);
  },
  async updateQuestionGroup(id: string | number, data: Omit<QuestionGroupItem, "id">): Promise<QuestionGroupItem> {
    return questionGroupApi.update(id, data);
  },
  async deleteQuestionGroup(id: string | number): Promise<void> {
    await questionGroupApi.delete(id);
  },

  // Question Levels
  async getQuestionLevels(): Promise<QuestionLevelItem[]> {
    return questionLevelApi.getAll();
  },
  async addQuestionLevel(data: Omit<QuestionLevelItem, "id">): Promise<QuestionLevelItem> {
    return questionLevelApi.create(data);
  },
  async updateQuestionLevel(id: string | number, data: Omit<QuestionLevelItem, "id">): Promise<QuestionLevelItem> {
    return questionLevelApi.update(id, data);
  },
  async deleteQuestionLevel(id: string | number): Promise<void> {
    await questionLevelApi.delete(id);
  },

  // Question Banks
  async getQuestionBanks(): Promise<QuestionBankItem[]> {
    return questionBankApi.getAll();
  },
  async addQuestionBank(data: Omit<QuestionBankItem, "id">): Promise<QuestionBankItem> {
    return questionBankApi.create(data);
  },
  async updateQuestionBank(id: string | number, data: Omit<QuestionBankItem, "id">): Promise<QuestionBankItem> {
    return questionBankApi.update(id, data);
  },
  async deleteQuestionBank(id: string | number): Promise<void> {
    await questionBankApi.delete(id);
  },

  // Online Exams
  async getOnlineExams(): Promise<OnlineExamItem[]> {
    return onlineExamApi.getAll();
  },
  async addOnlineExam(data: Omit<OnlineExamItem, "id">): Promise<OnlineExamItem> {
    return onlineExamApi.create(data);
  },
  async updateOnlineExam(id: string | number, data: Omit<OnlineExamItem, "id">): Promise<OnlineExamItem> {
    return onlineExamApi.update(id, data);
  },
  async toggleOnlineExamPublished(id: string | number): Promise<OnlineExamItem> {
    return onlineExamApi.togglePublished(id);
  },
  async deleteOnlineExam(id: string | number): Promise<void> {
    await onlineExamApi.delete(id);
  },

  // Instructions
  async getInstructions(): Promise<InstructionItem[]> {
    return instructionApi.getAll();
  },
  async addInstruction(data: Omit<InstructionItem, "id">): Promise<InstructionItem> {
    return instructionApi.create(data);
  },
  async updateInstruction(id: string | number, data: Omit<InstructionItem, "id">): Promise<InstructionItem> {
    return instructionApi.update(id, data);
  },
  async deleteInstruction(id: string | number): Promise<void> {
    await instructionApi.delete(id);
  },

  // Take Exams
  async getTakeExams(): Promise<TakeExamItem[]> {
    return takeExamApi.getAll();
  },
  async addTakeExam(data: Omit<TakeExamItem, "id">): Promise<TakeExamItem> {
    return takeExamApi.create(data);
  },
  async updateTakeExam(id: string | number, data: Omit<TakeExamItem, "id">): Promise<TakeExamItem> {
    return takeExamApi.update(id, data);
  },
  async deleteTakeExam(id: string | number): Promise<void> {
    await takeExamApi.delete(id);
  },

  // Salary Templates
  async getSalaryTemplates(): Promise<SalaryTemplateItem[]> {
    return salaryTemplateApi.getAll();
  },
  async addSalaryTemplate(data: Omit<SalaryTemplateItem, "id">): Promise<SalaryTemplateItem> {
    return salaryTemplateApi.create(data);
  },
  async updateSalaryTemplate(id: string | number, data: Omit<SalaryTemplateItem, "id">): Promise<SalaryTemplateItem> {
    return salaryTemplateApi.update(id, data);
  },
  async deleteSalaryTemplate(id: string | number): Promise<void> {
    await salaryTemplateApi.delete(id);
  },

  // Hourly Templates
  async getHourlyTemplates(): Promise<HourlyTemplateItem[]> {
    return hourlyTemplateApi.getAll();
  },
  async addHourlyTemplate(data: Omit<HourlyTemplateItem, "id">): Promise<HourlyTemplateItem> {
    return hourlyTemplateApi.create(data);
  },
  async updateHourlyTemplate(id: string | number, data: Omit<HourlyTemplateItem, "id">): Promise<HourlyTemplateItem> {
    return hourlyTemplateApi.update(id, data);
  },
  async deleteHourlyTemplate(id: string | number): Promise<void> {
    await hourlyTemplateApi.delete(id);
  },

  // Overtimes
  async getOvertimes(): Promise<OvertimeItem[]> {
    return overtimeApi.getAll();
  },
  async addOvertime(data: Omit<OvertimeItem, "id">): Promise<OvertimeItem> {
    return overtimeApi.create(data);
  },
  async updateOvertime(id: string | number, data: Omit<OvertimeItem, "id">): Promise<OvertimeItem> {
    return overtimeApi.update(id, data);
  },
  async deleteOvertime(id: string | number): Promise<void> {
    await overtimeApi.delete(id);
  }
};
