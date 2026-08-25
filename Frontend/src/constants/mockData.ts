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
  ProfileDetails,
  UserItem
} from "../types";

export const MOCK_STUDENTS: Student[] = [
  { id: 1, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Alice Smith", roll: "101", email: "alice@example.com", className: "One", sectionName: "A", section: "A", gender: "Female", dob: "2016-03-15" },
  { id: 2, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "Bob Johnson", roll: "102", email: "bob@example.com", className: "One", sectionName: "A", section: "A", gender: "Male", dob: "2016-05-20" },
  { id: 3, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", name: "Chloe Davis", roll: "103", email: "chloe@example.com", className: "One", sectionName: "B", section: "B", gender: "Female", dob: "2016-08-10" },
  { id: 4, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "Charlie Brown", roll: "201", email: "charlie@example.com", className: "Two", sectionName: "A", section: "A", gender: "Male", dob: "2015-02-12" },
  { id: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "Diana Prince", roll: "202", email: "diana@example.com", className: "Two", sectionName: "A", section: "A", gender: "Female", dob: "2015-07-24" },
  { id: 6, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", name: "Ethan Hunt", roll: "301", email: "ethan@example.com", className: "Three", sectionName: "A", section: "A", gender: "Male", dob: "2014-11-05" },
  { id: 7, photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop", name: "Fiona Gallagher", roll: "302", email: "fiona@example.com", className: "Three", sectionName: "B", section: "B", gender: "Female", dob: "2014-04-18" },
  { id: 8, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", name: "George Clark", roll: "401", email: "george@example.com", className: "Four", sectionName: "A", section: "A", gender: "Male", dob: "2013-09-30" },
  { id: 9, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", name: "Hannah Abbott", roll: "501", email: "hannah@example.com", className: "Five", sectionName: "A", section: "A", gender: "Female", dob: "2012-01-14" }
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 1, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", name: "Sarah Connor", email: "sarah.c@school.com", designation: "Science Teacher" },
  { id: 2, photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop", name: "John Doe", email: "john.doe@school.com", designation: "Math Teacher" },
  { id: 3, photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", name: "Emma Watson", email: "emma.w@school.com", designation: "English Teacher" },
  { id: 4, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", name: "Bruce Wayne", email: "bruce.w@school.com", designation: "History Teacher" }
];

export const MOCK_PARENTS: Parent[] = [
  { id: 1, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", name: "Lewis Rowley", email: "parent1@example.com", phone: "01344444444" },
  { id: 2, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", name: "Jennifer Johnson", email: "jennifer.j@gmail.com", phone: "+1 555 987 654" },
  { id: 3, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "David Brown", email: "david.brown@gmail.com", phone: "+1 555 456 789" },
  { id: 4, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Mary Williams", email: "mary.w@gmail.com", phone: "+1 555 222 333" }
];

export const INITIAL_VISITORS: Visitor[] = [
  { id: 1, visitorId: "1", name: "Maite Benson", toMeet: "Lewis Rowley", checkIn: "2025-01-08 12:53:12", checkOut: "", status: "in" }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  { id: 1, title: "Farewell Ceremony", date: "03 Jun 2025", notice: "The most of the words adopted by the Russian language in the field of sport are English..." },
  { id: 2, title: "Second Semester Exam", date: "13 Aug 2025", notice: "Dedicated athlete, an amateur player, or a sport geek, than you surely are familiar with the sport language..." },
  { id: 3, title: "First Semester Exam", date: "03 Apr 2025", notice: "If you are a dedicated athlete, an amateur player, or a sport geek, than you surely are familiar with..." },
  { id: 4, title: "Annual Sports Day", date: "18 Mar 2025", notice: "You surely are familiar with the sport language. An amateur player, or a sport geek..." },
  { id: 5, title: "Teachers Reunion", date: "19 Jul 2025", notice: "An amateur player, or a sport geek, than you surely are familiar with the sport language..." },
  { id: 6, title: "Reunions 2024 , batch 75.", date: "13 Apr 2025", notice: "The most of the words adopted by the Russian language in the field of sport are English..." },
  { id: 7, title: "Blood Donation Festival 2025", date: "08 May 2025", notice: "if you overlap your hobby and learning English, then you can easily guess the meaning of..." }
];

export const INITIAL_EVENTS: EventItem[] = [
  { id: 1, title: "Farewell Ceremony", date: "03 Jun 2025", details: "Farewell party for the outgoing batch of students, scheduled in the main assembly hall at 10:00 AM." },
  { id: 2, title: "Annual Sports Day", date: "18 Mar 2025", details: "Annual athletics competition and sports events. Parents are cordially invited to attend and cheer for their children." },
  { id: 3, title: "Teachers Reunion", date: "19 Jul 2025", details: "A gathering for former and current academic staff members to celebrate our progress and network." }
];

export const INITIAL_HOLIDAYS: HolidayItem[] = [
  { id: 1, title: "Summer Vacation", date: "01 Jun 2025 to 30 Jun 2025", details: "School will remain closed for summer vacation from June 1st to June 30th. Regular classes will resume on July 1st." },
  { id: 2, title: "Christmas Day", date: "25 Dec 2025", details: "Government holiday in observance of Christmas Day. All academic and administrative operations will be suspended." },
  { id: 3, title: "Eid-ul-Fitr Holiday", date: "20 Mar 2025", details: "Holiday on the occasion of Eid-ul-Fitr. Wishing all students, parents, and teachers a blessed Eid celebration!" }
];

export const MOCK_LEAVES: LeaveApplication[] = [
  { id: 1, applicationTo: "Principal", category: "Casual Leave", date: "2026-07-15", schedule: "2026-07-18 to 2026-07-20", days: 3, attachment: "-", status: "Pending" },
  { id: 2, applicationTo: "Headmaster", category: "Sick Leave", date: "2026-07-10", schedule: "2026-07-11 to 2026-07-12", days: 2, attachment: "medical_cert.pdf", status: "Approved" }
];

export const DEFAULT_ATTENDANCE: Record<string, Record<number, string>> = {
  'Jan': { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'W', 8: 'LE', 12: 'W', 13: 'P', 14: 'P', 15: 'P', 19: 'W', 26: 'W' },
  'Feb': { 2: 'W', 9: 'W', 16: 'W', 23: 'W' },
  'Mar': { 2: 'W', 9: 'W', 16: 'W', 23: 'W', 30: 'W' },
  'Apr': { 6: 'W', 13: 'W', 20: 'W', 27: 'W' },
  'May': { 4: 'W', 11: 'W', 18: 'W', 25: 'W' },
  'Jun': { 1: 'W', 8: 'W', 15: 'W', 18: 'H', 19: 'H', 20: 'H', 22: 'W', 29: 'W' },
  'Jul': { 6: 'W', 13: 'W', 20: 'W', 27: 'W' },
  'Aug': { 3: 'W', 10: 'W', 17: 'W', 24: 'W', 31: 'W' },
  'Sep': { 7: 'W', 14: 'H', 15: 'H', 16: 'H', 17: 'H', 18: 'H', 21: 'W', 28: 'W' },
  'Oct': { 5: 'W', 12: 'W', 19: 'W', 26: 'W' },
  'Nov': { 2: 'W', 9: 'W', 16: 'W', 23: 'W', 30: 'W' },
  'Dec': { 7: 'W', 14: 'W', 17: 'H', 18: 'H', 21: 'W', 25: 'H', 26: 'H', 28: 'W' },
};

export const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 1, title: "Joining Letter", date: "26 Nov 2025" },
  { id: 2, title: "Academic Certificate", date: "15 Jan 2024" }
];

export const MOCK_PROFILE_REGISTRY: Record<string, Record<string, ProfileDetails>> = {
  parents: {
    "1": {
      name: "Lewis Rowley",
      roleLabel: "Parents",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      gender: "Male",
      dob: "12 Oct 1980",
      phone: "01344444444",
      joiningDate: "26 Nov 2025",
      religion: "islam",
      email: "parent1@example.com",
      address: "khilkhet, Dhaka",
      username: "parent1"
    },
    "2": {
      name: "Jennifer Johnson",
      roleLabel: "Parents",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      gender: "Female",
      dob: "05 May 1985",
      phone: "01344444445",
      joiningDate: "26 Nov 2025",
      religion: "Christianity",
      email: "parent2@example.com",
      address: "Gulshan, Dhaka",
      username: "parent2"
    }
  },
  student: {
    "1": {
      name: "Alice Smith",
      roleLabel: "Student",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      gender: "Female",
      dob: "20 Mar 2015",
      phone: "01711223344",
      joiningDate: "01 Jan 2026",
      religion: "Christianity",
      email: "alice@example.com",
      address: "Dhanmondi, Dhaka",
      username: "student1",
      class: "Class 1",
      section: "A",
      roll: "101"
    }
  },
  teacher: {
    "1": {
      name: "Sarah Connor",
      roleLabel: "Teacher",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      gender: "Female",
      dob: "15 Aug 1988",
      phone: "01988776655",
      joiningDate: "15 Jan 2024",
      religion: "Christianity",
      email: "sarah.c@school.com",
      address: "Banani, Dhaka",
      username: "teacher1",
      designation: "Science Teacher",
      department: "Science"
    }
  },
  user: {
    "1": {
      name: "User 1",
      roleLabel: "User",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      gender: "Male",
      dob: "09 Apr 1973",
      phone: "+44079 0532 3213",
      joiningDate: "26 Nov 2025",
      religion: "islam",
      email: "user1@rhyta.com",
      address: "Mirpur, Dhaka",
      username: "user1"
    },
    "2": {
      name: "User 2",
      roleLabel: "Receptionist",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      gender: "Male",
      dob: "09 Apr 1973",
      phone: "+44079 0532 3213",
      joiningDate: "26 Nov 2025",
      religion: "islam",
      email: "user2@example.com",
      address: "38 Worthy Lane MAVESYN RIDWARE WS15 0QS",
      username: "receptionist"
    }
  }
};

export const DEFAULT_PROFILE: ProfileDetails = {
  name: "User 2",
  roleLabel: "Receptionist",
  photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  gender: "Male",
  dob: "09 Apr 1973",
  phone: "+44079 0532 3213",
  joiningDate: "26 Nov 2025",
  religion: "islam",
  email: "user2@example.com",
  address: "38 Worthy Lane MAVESYN RIDWARE WS15 0QS",
  username: "receptionist"
};

export const MOCK_USERS: UserItem[] = [
  { id: 1, photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", name: "User 1", email: "user1@rhyta.com", role: "Moderator" },
  { id: 2, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "User 2", email: "user2@example.com", role: "Receptionist" },
  { id: 3, photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop", name: "User 3", email: "user3@example.com", role: "Librarian" },
  { id: 4, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "User 4", email: "user4@example.com", role: "Accountant" },
  { id: 5, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", name: "Nazmus Sakib", email: "sakibb@gmail.com", role: "Accountant" }
];
