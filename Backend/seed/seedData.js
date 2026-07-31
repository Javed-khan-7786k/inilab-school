import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Student from "../src/models/Student.js";
import Teacher from "../src/models/Teacher.js";
import Parent from "../src/models/Parent.js";
import Visitor from "../src/models/Visitor.js";
import Notice from "../src/models/Notice.js";
import Event from "../src/models/Event.js";
import Holiday from "../src/models/Holiday.js";
import Leave from "../src/models/Leave.js";
import Document from "../src/models/Document.js";

dotenv.config();

const mockStudents = [
  { photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Alice Smith", roll: "101", email: "alice@example.com", className: "Class 1" },
  { photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "Bob Johnson", roll: "102", email: "bob@example.com", className: "Class 1" },
  { photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "Charlie Brown", roll: "103", email: "charlie@example.com", className: "Class 2" },
  { photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "Diana Prince", roll: "104", email: "diana@example.com", className: "Class 2" },
  { photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", name: "Ethan Hunt", roll: "105", email: "ethan@example.com", className: "Class 3" },
  { photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop", name: "Fiona Gallagher", roll: "106", email: "fiona@example.com", className: "Class 3" }
];

const mockTeachers = [
  { photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", name: "Sarah Connor", email: "sarah.c@school.com", designation: "Science Teacher" },
  { photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop", name: "John Doe", email: "john.doe@school.com", designation: "Math Teacher" },
  { photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", name: "Emma Watson", email: "emma.w@school.com", designation: "English Teacher" },
  { photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", name: "Bruce Wayne", email: "bruce.w@school.com", designation: "History Teacher" }
];

const mockParents = [
  { photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", name: "Lewis Rowley", email: "parent1@example.com", phone: "01344444444" },
  { photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", name: "Jennifer Johnson", email: "jennifer.j@gmail.com", phone: "+1 555 987 654" },
  { photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "David Brown", email: "david.brown@gmail.com", phone: "+1 555 456 789" },
  { photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Mary Williams", email: "mary.w@gmail.com", phone: "+1 555 222 333" }
];

const mockVisitors = [
  { visitorId: "1", name: "Maite Benson", toMeet: "Lewis Rowley", checkIn: "2025-01-08 12:53:12", checkOut: "", status: "in" }
];

const mockNotices = [
  { title: "Farewell Ceremony", date: "03 Jun 2025", notice: "The most of the words adopted by the Russian language in the field of sport are English..." },
  { title: "Second Semester Exam", date: "13 Aug 2025", notice: "Dedicated athlete, an amateur player, or a sport geek, than you surely are familiar with the sport language..." },
  { title: "First Semester Exam", date: "03 Apr 2025", notice: "If you are a dedicated athlete, an amateur player, or a sport geek, than you surely are familiar with..." },
  { title: "Annual Sports Day", date: "18 Mar 2025", notice: "You surely are familiar with the sport language. An amateur player, or a sport geek..." },
  { title: "Teachers Reunion", date: "19 Jul 2025", notice: "An amateur player, or a sport geek, than you surely are familiar with the sport language..." },
  { title: "Reunions 2024 , batch 75.", date: "13 Apr 2025", notice: "The most of the words adopted by the Russian language in the field of sport are English..." },
  { title: "Blood Donation Festival 2025", date: "08 May 2025", notice: "if you overlap your hobby and learning English, then you can easily guess the meaning of..." }
];

const mockEvents = [
  { title: "Farewell Ceremony", date: "03 Jun 2025", details: "Farewell party for the outgoing batch of students, scheduled in the main assembly hall at 10:00 AM." },
  { title: "Annual Sports Day", date: "18 Mar 2025", details: "Annual athletics competition and sports events. Parents are cordially invited to attend and cheer for their children." },
  { title: "Teachers Reunion", date: "19 Jul 2025", details: "A gathering for former and current academic staff members to celebrate our progress and network." }
];

const mockHolidays = [
  { title: "Summer Vacation", date: "01 Jun 2025 to 30 Jun 2025", details: "School will remain closed for summer vacation from June 1st to June 30th. Regular classes will resume on July 1st." },
  { title: "Christmas Day", date: "25 Dec 2025", details: "Government holiday in observance of Christmas Day. All academic and administrative operations will be suspended." },
  { title: "Eid-ul-Fitr Holiday", date: "20 Mar 2025", details: "Holiday on the occasion of Eid-ul-Fitr. Wishing all students, parents, and teachers a blessed Eid celebration!" }
];

const mockLeaves = [
  { applicationTo: "Principal", category: "Casual Leave", date: "2026-07-15", schedule: "2026-07-18 to 2026-07-20", days: 3, attachment: "-", status: "Pending" },
  { applicationTo: "Headmaster", category: "Sick Leave", date: "2026-07-10", schedule: "2026-07-11 to 2026-07-12", days: 2, attachment: "medical_cert.pdf", status: "Approved" }
];

const mockDocuments = [
  { title: "Joining Letter", date: "26 Nov 2025" },
  { title: "Academic Certificate", date: "15 Jan 2024" }
];

const mockUsers = [
  // Admin credentials
  {
    username: "admin",
    password: "123456",
    role: "Admin",
    name: "Admin User",
    email: "admin@school.com",
    phone: "01345555555",
    address: "Banani, Dhaka",
    religion: "Islam",
    joiningDate: "01 Jan 2020",
  },
  // Teacher1 (Sarah Connor)
  {
    username: "teacher1",
    password: "123456",
    role: "Teacher",
    name: "Sarah Connor",
    email: "sarah.c@school.com",
    phone: "01988776655",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    gender: "Female",
    dob: "15 Aug 1988",
    joiningDate: "15 Jan 2024",
    religion: "Christianity",
    address: "Banani, Dhaka",
    designation: "Science Teacher",
    department: "Science"
  },
  // Student1 (Alice Smith)
  {
    username: "student1",
    password: "123456",
    role: "Student",
    name: "Alice Smith",
    email: "alice@example.com",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    gender: "Female",
    dob: "20 Mar 2015",
    phone: "01711223344",
    joiningDate: "01 Jan 2026",
    religion: "Christianity",
    address: "Dhanmondi, Dhaka",
    class: "Class 1",
    section: "A",
    roll: "101"
  },
  // Parent1 (Lewis Rowley)
  {
    username: "parent1",
    password: "123456",
    role: "Parent",
    name: "Lewis Rowley",
    email: "parent1@example.com",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    gender: "Male",
    dob: "12 Oct 1980",
    phone: "01344444444",
    joiningDate: "26 Nov 2025",
    religion: "islam",
    address: "khilkhet, Dhaka",
  },
  // Parent2 (Jennifer Johnson)
  {
    username: "parent2",
    password: "123456",
    role: "Parent",
    name: "Jennifer Johnson",
    email: "parent2@example.com",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    gender: "Female",
    dob: "05 May 1985",
    phone: "01344444445",
    joiningDate: "26 Nov 2025",
    religion: "Christianity",
    address: "Gulshan, Dhaka",
  },
  // Accountant (Nazmus Sakib)
  {
    username: "accountant",
    password: "123456",
    role: "Accountant",
    name: "Nazmus Sakib",
    email: "sakibb@gmail.com",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    phone: "+44079 0532 3214",
    address: "Mirpur, Dhaka",
    religion: "islam",
    joiningDate: "26 Nov 2025",
  },
  // Librarian (User 3)
  {
    username: "librarian",
    password: "123456",
    role: "Librarian",
    name: "User 3",
    email: "user3@example.com",
    photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
    phone: "+44078 0833 2765",
    address: "92 Sea Road LAMINGTON ML12 7DA",
    religion: "islam",
    joiningDate: "26 Nov 2025",
  },
  // Receptionist (User 2)
  {
    username: "receptionist",
    password: "123456",
    role: "Receptionist",
    name: "User 2",
    email: "user2@example.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    gender: "Male",
    dob: "09 Apr 1973",
    phone: "+44079 0532 3213",
    joiningDate: "26 Nov 2025",
    religion: "islam",
    address: "38 Worthy Lane MAVESYN RIDWARE WS15 0QS",
  },
  // User 1 (Moderator)
  {
    username: "user1",
    password: "123456",
    role: "Moderator",
    name: "User 1",
    email: "user1@rhyta.com",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    gender: "Male",
    dob: "09 Apr 1973",
    phone: "+44079 0532 3213",
    joiningDate: "26 Nov 2025",
    religion: "islam",
    address: "Mirpur, Dhaka",
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected. Cleaning existing collections...");

    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Parent.deleteMany({});
    await Visitor.deleteMany({});
    await Notice.deleteMany({});
    await Event.deleteMany({});
    await Holiday.deleteMany({});
    await Leave.deleteMany({});
    await Document.deleteMany({});

    console.log("Collections cleared. Seeding data...");

    // Seed Users (passwords will be hashed pre-save)
    for (const u of mockUsers) {
      await User.create(u);
    }
    console.log(`Seeded ${mockUsers.length} users successfully.`);

    // Seed Students
    await Student.insertMany(mockStudents);
    console.log(`Seeded ${mockStudents.length} students successfully.`);

    // Seed Teachers
    await Teacher.insertMany(mockTeachers);
    console.log(`Seeded ${mockTeachers.length} teachers successfully.`);

    // Seed Parents
    await Parent.insertMany(mockParents);
    console.log(`Seeded ${mockParents.length} parents successfully.`);

    // Seed Visitors
    await Visitor.insertMany(mockVisitors);
    console.log(`Seeded ${mockVisitors.length} visitors successfully.`);

    // Seed Notices
    await Notice.insertMany(mockNotices);
    console.log(`Seeded ${mockNotices.length} notices successfully.`);

    // Seed Events
    await Event.insertMany(mockEvents);
    console.log(`Seeded ${mockEvents.length} events successfully.`);

    // Seed Holidays
    await Holiday.insertMany(mockHolidays);
    console.log(`Seeded ${mockHolidays.length} holidays successfully.`);

    // Seed Leaves
    await Leave.insertMany(mockLeaves);
    console.log(`Seeded ${mockLeaves.length} leave applications successfully.`);

    // Seed Documents
    await Document.insertMany(mockDocuments);
    console.log(`Seeded ${mockDocuments.length} documents successfully.`);

    console.log("Database Seeding Completed Successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Database Seeding Failed:", error);
    process.exit(1);
  }
};

seedDB();
