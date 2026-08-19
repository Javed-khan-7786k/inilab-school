import Joi from "joi";

// Common metadata fields
const commonMeta = {
  id: Joi.any().optional(),
  _id: Joi.any().optional(),
  createdAt: Joi.any().optional(),
  updatedAt: Joi.any().optional(),
  __v: Joi.any().optional(),
};

// Auth Schemas
export const authLoginSchema = Joi.object({
  username: Joi.string().required().trim().messages({
    "string.empty": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  ...commonMeta,
}).unknown(true);

// Exam Schemas
export const examSchema = Joi.object({
  name: Joi.string().optional().allow("", null),
  examName: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  note: Joi.string().optional().allow("", null),
  ...commonMeta,
}).or("name", "examName").unknown(true);

// Exam Schedule Schema
export const examScheduleSchema = Joi.object({
  exam: Joi.string().optional().allow("", null),
  examName: Joi.string().optional().allow("", null),
  examId: Joi.any().optional(),
  class: Joi.string().optional().allow("", null),
  className: Joi.string().optional().allow("", null),
  classId: Joi.any().optional(),
  section: Joi.string().optional().allow("", null),
  sectionName: Joi.string().optional().allow("", null),
  sectionId: Joi.any().optional(),
  subject: Joi.string().optional().allow("", null),
  subjectName: Joi.string().optional().allow("", null),
  subjectId: Joi.any().optional(),
  date: Joi.string().optional().allow("", null),
  time: Joi.string().optional().allow("", null),
  timeFrom: Joi.string().optional().allow("", null),
  timeTo: Joi.string().optional().allow("", null),
  room: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

// Grade Schema
export const gradeSchema = Joi.object({
  name: Joi.string().optional().allow("", null),
  gradeName: Joi.string().optional().allow("", null),
  gradePoint: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  markFrom: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  markTo: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  markUpto: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  note: Joi.string().optional().allow("", null),
  ...commonMeta,
}).or("name", "gradeName").unknown(true);

// Exam Attendance Schemas
export const examAttendanceRecordSchema = Joi.object({
  examName: Joi.string().optional().allow("", null),
  className: Joi.string().optional().allow("", null),
  sectionName: Joi.string().optional().allow("", null),
  subjectName: Joi.string().optional().allow("", null),
  studentId: Joi.any().optional(),
  studentName: Joi.string().optional().allow("", null),
  roll: Joi.any().optional(),
  email: Joi.string().optional().allow("", null),
  photo: Joi.string().optional().allow("", null),
  status: Joi.string().valid("Present", "Absent", "Late").required(),
  exam: Joi.string().optional().allow("", null),
  class: Joi.string().optional().allow("", null),
  section: Joi.string().optional().allow("", null),
  subject: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  attendance: Joi.array().optional(),
  ...commonMeta,
}).unknown(true);

export const examAttendanceBulkSchema = Joi.alternatives().try(
  Joi.object({
    records: Joi.array().items(examAttendanceRecordSchema).required(),
  }).unknown(true),
  Joi.array().items(examAttendanceRecordSchema)
);

export const examAttendanceSchema = Joi.alternatives().try(
  examAttendanceRecordSchema,
  examAttendanceBulkSchema
);

// Teacher Schema
export const teacherSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Teacher name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),
  designation: Joi.string().optional().allow("", null),
  phone: Joi.string().optional().allow("", null),
  gender: Joi.string().optional().allow("", null),
  department: Joi.string().optional().allow("", null),
  joinDate: Joi.string().optional().allow("", null),
  address: Joi.string().optional().allow("", null),
  photo: Joi.string().optional().allow("", null),
  infiniteDocuments: Joi.array().optional(),
  ...commonMeta,
}).unknown(true);

// Student Schema
export const studentSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Student name is required",
  }),
  class: Joi.string().optional().allow("", null),
  className: Joi.string().optional().allow("", null),
  section: Joi.string().optional().allow("", null),
  sectionName: Joi.string().optional().allow("", null),
  roll: Joi.any().optional(),
  gender: Joi.string().optional().allow("", null),
  bloodGroup: Joi.string().optional().allow("", null),
  email: Joi.string().optional().allow("", null),
  phone: Joi.string().optional().allow("", null),
  address: Joi.string().optional().allow("", null),
  avatar: Joi.string().optional().allow("", null),
  photo: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

// User Schema
export const userSchema = Joi.object({
  name: Joi.string().required().trim(),
  username: Joi.string().required().trim(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow("", null),
  role: Joi.string().required(),
  password: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

// Enquiry Schema
export const enquirySchema = Joi.object({
  name: Joi.string().optional().allow("", null),
  studentName: Joi.string().optional().allow("", null),
  email: Joi.string().optional().allow("", null),
  phone: Joi.string().optional().allow("", null),
  fatherContact: Joi.string().optional().allow("", null),
  class: Joi.string().optional().allow("", null),
  applyingClass: Joi.string().optional().allow("", null),
  source: Joi.string().optional().allow("", null),
  status: Joi.string().optional().allow("", null),
  notes: Joi.string().optional().allow("", null),
  childAadhaar: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

// Class, Section, Subject Schemas
export const classSchema = Joi.object({
  name: Joi.string().required().trim(),
  numericName: Joi.any().optional(),
  teacherId: Joi.any().optional(),
  note: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

export const sectionSchema = Joi.object({
  name: Joi.string().required().trim(),
  category: Joi.string().optional().allow("", null),
  capacity: Joi.any().optional(),
  teacherId: Joi.any().optional(),
  classId: Joi.any().optional(),
  className: Joi.string().optional().allow("", null),
  note: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

export const subjectSchema = Joi.object({
  name: Joi.string().required().trim(),
  subjectCode: Joi.string().optional().allow("", null),
  code: Joi.string().optional().allow("", null),
  classId: Joi.any().optional(),
  className: Joi.string().optional().allow("", null),
  type: Joi.string().optional().allow("", null),
  passMark: Joi.any().optional(),
  finalMark: Joi.any().optional(),
  ...commonMeta,
}).unknown(true);

// Notice, Event, Holiday Schemas
export const noticeSchema = Joi.object({
  title: Joi.string().required().trim(),
  notice: Joi.string().optional().allow("", null),
  description: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

export const eventSchema = Joi.object({
  title: Joi.string().required().trim(),
  details: Joi.string().optional().allow("", null),
  fromDate: Joi.string().optional().allow("", null),
  toDate: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

export const holidaySchema = Joi.object({
  title: Joi.string().required().trim(),
  details: Joi.string().optional().allow("", null),
  fromDate: Joi.string().optional().allow("", null),
  toDate: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);

// Visitor Schema
export const visitorSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().optional().allow("", null),
  phone: Joi.string().optional().allow("", null),
  company: Joi.string().optional().allow("", null),
  purpose: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  inTime: Joi.string().optional().allow("", null),
  outTime: Joi.string().optional().allow("", null),
  ...commonMeta,
}).unknown(true);
