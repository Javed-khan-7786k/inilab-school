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

import type {
  Student,
  Teacher,
  Parent,
  Visitor,
  NoticeItem,
  EventItem,
  HolidayItem,
  LeaveApplication,
  DocumentItem,
  UserItem,
  Enquiry,
  StudentListItem
} from "../types";

export const dataService = {
  // Students
  async getStudents(): Promise<Student[]> {
    return studentApi.getAll();
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
  }
};
