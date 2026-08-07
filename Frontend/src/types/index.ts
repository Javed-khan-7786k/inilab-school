export interface Student {
  id: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
}

export interface StudentListItem {
  id: string | number;
  rawId: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
  status: string;
  source: string;
}

export interface DocumentObject {
  name: string;
  file: string;
}

export interface Teacher {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  designation: string;
  infiniteDocuments?: DocumentObject[];
}

export interface Parent {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  phone: string;
}

export interface Visitor {
  id: string | number;
  visitorId: string;
  name: string;
  toMeet: string;
  checkIn: string;
  checkOut: string;
  status: 'in' | 'out';
}

export interface NoticeItem {
  id: string | number;
  title: string;
  date: string;
  notice: string;
  targetRoles?: string[];
}

export interface MailSMSItem {
  id: string | number;
  role: string;
  users: string;
  type: string;
  dateTime: string;
  message: string;
}

export interface QuestionGroupItem {
  id: string | number;
  title: string;
}

export interface QuestionLevelItem {
  id: string | number;
  title: string;
}

export interface QuestionBankItem {
  id: string | number;
  difficultyLevel: string;
  question: string;
  questionGroup: string;
  questionType: string;
  explanation?: string;
  mark?: number;
}

export interface OnlineExamItem {
  id: string | number;
  examTitle: string;
  examStatus: string;
  date: string;
  published: boolean;
}

export interface InstructionItem {
  id: string | number;
  title: string;
  content: string;
}

export interface TakeExamItem {
  id: string | number;
  name: string;
  examStatus: string;
  duration: string;
  date: string;
}

export interface SalaryTemplateItem {
  id: string | number;
  salaryGrade: string;
  basicSalary: string;
  overtimeRate: string;
}

export interface HourlyTemplateItem {
  id: string | number;
  hourlyGrade: string;
  hourlyRate: string;
}

export interface OvertimeItem {
  id: string | number;
  role: string;
  user: string;
  date: string;
  hours: string;
  totalAmount: string;
}

export interface EventItem {
  id: string | number;
  title: string;
  date: string;
  details: string;
  targetRoles?: string[];
}

export interface HolidayItem {
  id: string | number;
  title: string;
  date: string;
  details: string;
}

export interface LeaveApplication {
  id: string | number;
  applicationTo: string;
  category: string;
  date: string;
  schedule: string;
  days: number;
  attachment: string;
  status: string;
}

export interface DocumentItem {
  id: string | number;
  title: string;
  date: string;
}

export interface ProfileDetails {
  name: string;
  roleLabel: string;
  photo: string;
  gender: string;
  dob: string;
  phone: string;
  joiningDate: string;
  religion: string;
  email: string;
  address: string;
  username: string;
  class?: string;
  section?: string;
  roll?: string;
  designation?: string;
  department?: string;
  documents?: DocumentObject[];
}

export interface UserItem {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  role: string;
}

export interface StaffListItem {
  id: string | number;
  rawId: string | number;
  photo: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  type: 'teacher' | 'user';
  status?: string;
}

export interface ClassItem {
  id: string | number;
  name: string;
  classNumeric: number | string;
  teacherName: string;
  teacherId?: string;
  note?: string;
}

export interface SectionItem {
  id: string | number;
  name: string;
  category: string;
  capacity: number | string;
  className: string;
  classId?: string;
  teacherName: string;
  teacherId?: string;
  note?: string;
}

export interface SubjectItem {
  id: string | number;
  name: string;
  author?: string;
  code: string;
  className: string;
  classId?: string;
  teacherName: string;
  teacherId?: string;
  passMark: number | string;
  finalMark: number | string;
}

export interface SyllabusItem {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  uploader: string;
  file?: string;
  className: string;
  classId?: string;
}

export interface AssignmentItem {
  id: string | number;
  title: string;
  description: string;
  deadline: string;
  className: string;
  classId?: string;
  sectionName?: string;
  sectionId?: string;
  subjectName: string;
  subjectId?: string;
  uploader: string;
  file?: string;
}

export interface RoutineItem {
  id: string | number;
  schoolYear: string;
  className: string;
  classId?: string;
  sectionName: string;
  sectionId?: string;
  subjectName: string;
  subjectId?: string;
  day: string;
  teacherName: string;
  teacherId?: string;
  startingTime: string;
  endingTime: string;
  room: string;
}

export interface ExamItem {
  id: string | number;
  name: string;
  date: string;
  note?: string;
}

export interface ExamScheduleItem {
  id: string | number;
  examName: string;
  examId?: string;
  className: string;
  classId?: string;
  sectionName: string;
  sectionId?: string;
  subjectName: string;
  subjectId?: string;
  date: string;
  time: string;
  room: string;
}

export interface GradeItem {
  id: string | number;
  gradeName: string;
  gradePoint: string;
  markFrom: number | string;
  markUpto: number | string;
  note?: string;
}

export interface ExamAttendanceItem {
  id: string | number;
  examName: string;
  examId?: string;
  className: string;
  classId?: string;
  sectionName?: string;
  sectionId?: string;
  subjectName: string;
  subjectId?: string;
  studentId?: string;
  studentName: string;
  roll: string;
  email: string;
  photo?: string;
  status: "Present" | "Absent" | "Late";
}

export interface MarkItem {
  id: string | number;
  examName: string;
  examId?: string;
  className: string;
  classId?: string;
  sectionName?: string;
  sectionId?: string;
  subjectName: string;
  subjectId?: string;
  studentId?: string;
  studentName: string;
  roll: string;
  email: string;
  photo?: string;
  examMark: number;
  attendanceMark: number;
  classTestMark: number;
  assignmentMark: number;
  totalMark?: number;
}

export interface MarkDistributionItem {
  id: string | number;
  markDistributionType: string;
  markValue: number | string;
}

export interface PromotionSettingItem {
  id?: string;
  academicYear: string;
  className: string;
  promotionAcademicYear: string;
  promotionClassName: string;
  promotionType: "Normal" | "Advance";
  selectedExams?: string[];
  subjectPassMarks?: Record<string, number | string>;
}

export interface Enquiry {
  id: string | number;
  studentName: string;
  applyingClass: string;
  dob: string;
  gender: string;
  
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  fatherEmail: string;
  fatherAadhaar?: string;
  
  motherName: string;
  motherOccupation: string;
  motherContact: string;
  motherEmail: string;
  motherAadhaar?: string;
  
  address: string;
  state: string;
  district: string;
  pinCode: string;
  
  childAadhaar?: string;
  stream?: string;
  aparId?: string;
  penNumber?: string;
  
  previousSchool?: string;
  previousSchoolAddress?: string;
  previousSchoolId?: string;
  lastClassAttended?: string;

  photo?: string;
  documents?: DocumentObject[];
  status: 'New' | 'Contacted' | 'Follow-up' | 'Admission Confirmed' | 'Rejected' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | Record<string, any>;
}

// Combined item for Admin's Student page (Admitted students + Not-yet-admitted enquiries)
export interface Student {
  id: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
  stream?: string;
  sectionName?: string;
  avatar?: string;

  // Extended admission profile (optional — filled when added via full Student form)
  dob?: string;
  gender?: string;
  fatherName?: string;
  fatherOccupation?: string;
  fatherContact?: string;
  fatherEmail?: string;
  fatherAadhaar?: string;
  motherName?: string;
  motherOccupation?: string;
  motherContact?: string;
  motherEmail?: string;
  motherAadhaar?: string;
  address?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  childAadhaar?: string;
  aparId?: string;
  penNumber?: string;
  previousSchool?: string;
  previousSchoolAddress?: string;
  previousSchoolId?: string;
  lastClassAttended?: string;
  documents?: DocumentObject[];
}
