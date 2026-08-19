import Joi from "joi";

// Auth Schemas
export const authLoginSchema = Joi.object({
  username: Joi.string().required().trim().messages({
    "string.empty": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Exam Schemas
export const examSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Exam name is required",
  }),
  date: Joi.string().optional().allow("", null),
  note: Joi.string().optional().allow("", null),
});

// Exam Schedule Schema
export const examScheduleSchema = Joi.object({
  exam: Joi.string().required().trim().messages({
    "string.empty": "Exam is required",
  }),
  class: Joi.string().required().trim().messages({
    "string.empty": "Class is required",
  }),
  section: Joi.string().required().trim().messages({
    "string.empty": "Section is required",
  }),
  subject: Joi.string().required().trim().messages({
    "string.empty": "Subject is required",
  }),
  date: Joi.string().required().trim().messages({
    "string.empty": "Exam date is required",
  }),
  timeFrom: Joi.string().required().trim().messages({
    "string.empty": "Start time is required",
  }),
  timeTo: Joi.string().required().trim().messages({
    "string.empty": "End time is required",
  }),
  room: Joi.string().required().trim().messages({
    "string.empty": "Room number is required",
  }),
});

// Grade Schema
export const gradeSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Grade name is required",
  }),
  gradePoint: Joi.number().required().min(0).messages({
    "number.base": "Grade point must be a number",
  }),
  markFrom: Joi.number().required().min(0).max(100).messages({
    "number.base": "Mark from must be a number",
  }),
  markTo: Joi.number().required().min(0).max(100).messages({
    "number.base": "Mark to must be a number",
  }),
  note: Joi.string().optional().allow("", null),
});

// Exam Attendance Schemas
export const examAttendanceRecordSchema = Joi.object({
  examName: Joi.string().optional().allow("", null),
  className: Joi.string().optional().allow("", null),
  sectionName: Joi.string().optional().allow("", null),
  subjectName: Joi.string().optional().allow("", null),
  studentId: Joi.string().optional().allow("", null),
  studentName: Joi.string().optional().allow("", null),
  roll: Joi.string().optional().allow("", null),
  email: Joi.string().optional().allow("", null),
  photo: Joi.string().optional().allow("", null),
  status: Joi.string().valid("Present", "Absent", "Late").required(),
  exam: Joi.string().optional().allow("", null),
  class: Joi.string().optional().allow("", null),
  section: Joi.string().optional().allow("", null),
  subject: Joi.string().optional().allow("", null),
  date: Joi.string().optional().allow("", null),
  attendance: Joi.array().optional(),
});

export const examAttendanceBulkSchema = Joi.alternatives().try(
  Joi.object({
    records: Joi.array().items(examAttendanceRecordSchema).required(),
  }),
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
  phone: Joi.string().optional().allow("", null),
  gender: Joi.string().optional().allow("", null),
  designation: Joi.string().optional().allow("", null),
  department: Joi.string().optional().allow("", null),
  joinDate: Joi.string().optional().allow("", null),
  address: Joi.string().optional().allow("", null),
});

// Student Schema
export const studentSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Student name is required",
  }),
  class: Joi.string().required().trim().messages({
    "string.empty": "Class is required",
  }),
  section: Joi.string().required().trim().messages({
    "string.empty": "Section is required",
  }),
  roll: Joi.string().required().trim().messages({
    "string.empty": "Roll number is required",
  }),
  gender: Joi.string().optional().allow("", null),
  bloodGroup: Joi.string().optional().allow("", null),
  email: Joi.string().email().optional().allow("", null),
  phone: Joi.string().optional().allow("", null),
  address: Joi.string().optional().allow("", null),
});

// User Schema
export const userSchema = Joi.object({
  name: Joi.string().required().trim(),
  username: Joi.string().required().trim(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow("", null),
  role: Joi.string().required(),
  password: Joi.string().optional().allow("", null),
});

// Enquiry Schema
export const enquirySchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Applicant name is required",
  }),
  email: Joi.string().email().optional().allow("", null),
  phone: Joi.string().required().trim().messages({
    "string.empty": "Phone number is required",
  }),
  class: Joi.string().optional().allow("", null),
  source: Joi.string().optional().allow("", null),
  status: Joi.string().optional().allow("", null),
  notes: Joi.string().optional().allow("", null),
  childAadhaar: Joi.string().optional().allow("", null),
});

// Class, Section, Subject Schemas
export const classSchema = Joi.object({
  name: Joi.string().required().trim(),
  numericName: Joi.number().optional(),
  teacherId: Joi.string().optional().allow("", null),
  note: Joi.string().optional().allow("", null),
});

export const sectionSchema = Joi.object({
  name: Joi.string().required().trim(),
  category: Joi.string().optional().allow("", null),
  capacity: Joi.number().optional(),
  teacherId: Joi.string().optional().allow("", null),
  classId: Joi.string().optional().allow("", null),
  note: Joi.string().optional().allow("", null),
});

export const subjectSchema = Joi.object({
  name: Joi.string().required().trim(),
  subjectCode: Joi.string().required().trim(),
  classId: Joi.string().optional().allow("", null),
  type: Joi.string().optional().allow("", null),
  passMark: Joi.number().optional(),
  finalMark: Joi.number().optional(),
});

// Notice, Event, Holiday Schemas
export const noticeSchema = Joi.object({
  title: Joi.string().required().trim(),
  notice: Joi.string().required().trim(),
  date: Joi.string().optional().allow("", null),
});

export const eventSchema = Joi.object({
  title: Joi.string().required().trim(),
  details: Joi.string().optional().allow("", null),
  fromDate: Joi.string().required().trim(),
  toDate: Joi.string().required().trim(),
});

export const holidaySchema = Joi.object({
  title: Joi.string().required().trim(),
  details: Joi.string().optional().allow("", null),
  fromDate: Joi.string().required().trim(),
  toDate: Joi.string().required().trim(),
});

// Visitor Schema
export const visitorSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().optional().allow("", null),
  phone: Joi.string().required().trim(),
  company: Joi.string().optional().allow("", null),
  purpose: Joi.string().required().trim(),
  date: Joi.string().optional().allow("", null),
  inTime: Joi.string().optional().allow("", null),
  outTime: Joi.string().optional().allow("", null),
});
