import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "../src/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ==============================================================================
// DATABASE SEED SCRIPT FOR INILAB SCHOOL SYSTEM
// To reseed database, run: npm run seed  (or: node seed/seedData.js)
// ==============================================================================
import Student from "../src/models/Student.js";
import Teacher from "../src/models/Teacher.js";
import Parent from "../src/models/Parent.js";
import Visitor from "../src/models/Visitor.js";
import Notice from "../src/models/Notice.js";
import Event from "../src/models/Event.js";
import Holiday from "../src/models/Holiday.js";
import Leave from "../src/models/Leave.js";
import Document from "../src/models/Document.js";
import ClassModel from "../src/models/ClassModel.js";
import SectionModel from "../src/models/SectionModel.js";
import SubjectModel from "../src/models/SubjectModel.js";
import SyllabusModel from "../src/models/SyllabusModel.js";
import AssignmentModel from "../src/models/AssignmentModel.js";
import RoutineModel from "../src/models/RoutineModel.js";
import ExamModel from "../src/models/ExamModel.js";
import ExamScheduleModel from "../src/models/ExamScheduleModel.js";
import GradeModel from "../src/models/GradeModel.js";
import ExamAttendanceModel from "../src/models/ExamAttendanceModel.js";
import MarkModel from "../src/models/MarkModel.js";
import MarkDistributionModel from "../src/models/MarkDistributionModel.js";
import PromotionSettingModel from "../src/models/PromotionSettingModel.js";
import Fee from "../src/models/Fee.js";

// ==============================================================================
// DATABASE SEED SCRIPT FOR INILAB SCHOOL SYSTEM
// To reseed database, run: npm run seed  (or: node seed/seedData.js)
// ==============================================================================

const mockStudents = [
  // Class One
  { photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Alice Smith", roll: "101", email: "alice@example.com", className: "One", sectionName: "A", section: "A", gender: "Female", dob: "2016-03-15", fatherName: "John Smith", address: "Dhanmondi, Dhaka" },
  { photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "Bob Johnson", roll: "102", email: "bob@example.com", className: "One", sectionName: "A", section: "A", gender: "Male", dob: "2016-05-20", fatherName: "Robert Johnson", address: "Banani, Dhaka" },
  { photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", name: "Chloe Davis", roll: "103", email: "chloe@example.com", className: "One", sectionName: "B", section: "B", gender: "Female", dob: "2016-08-10", fatherName: "Mark Davis", address: "Gulshan, Dhaka" },

  // Class Two
  { photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "Charlie Brown", roll: "201", email: "charlie@example.com", className: "Two", sectionName: "A", section: "A", gender: "Male", dob: "2015-02-12", fatherName: "David Brown", address: "Uttara, Dhaka" },
  { photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "Diana Prince", roll: "202", email: "diana@example.com", className: "Two", sectionName: "A", section: "A", gender: "Female", dob: "2015-07-24", fatherName: "Bruce Prince", address: "Mirpur, Dhaka" },

  // Class Three
  { photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", name: "Ethan Hunt", roll: "301", email: "ethan@example.com", className: "Three", sectionName: "A", section: "A", gender: "Male", dob: "2014-11-05", fatherName: "Jim Hunt", address: "Badda, Dhaka" },
  { photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop", name: "Fiona Gallagher", roll: "302", email: "fiona@example.com", className: "Three", sectionName: "B", section: "B", gender: "Female", dob: "2014-04-18", fatherName: "Frank Gallagher", address: "Mohakhali, Dhaka" },

  // Class Four
  { photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", name: "George Clark", roll: "401", email: "george@example.com", className: "Four", sectionName: "A", section: "A", gender: "Male", dob: "2013-09-30", fatherName: "William Clark", address: "Khilkhet, Dhaka" },

  // Class Five
  { photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", name: "Hannah Abbott", roll: "501", email: "hannah@example.com", className: "Five", sectionName: "A", section: "A", gender: "Female", dob: "2012-01-14", fatherName: "Arthur Abbott", address: "Rampura, Dhaka" }
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
    class: "One",
    className: "One",
    section: "A",
    sectionName: "A",
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
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://javedkhan7786king_db_user:72kEIpZEssh9lfSf@cluster0.irqx55n.mongodb.net/";
    await mongoose.connect(mongoUri);
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
    await Fee.deleteMany({});

    console.log("Collections cleared. Seeding data...");

    // Seed Users (passwords will be hashed pre-save)
    for (const u of mockUsers) {
      await User.create(u);
    }
    console.log(`Seeded ${mockUsers.length} users successfully.`);

    // Seed Students
    await Student.insertMany(mockStudents);
    console.log(`Seeded ${mockStudents.length} students successfully.`);

    // Seed Fees
    const dbStudents = await Student.find();
    const generateDefaultMonthlyDetails = () => {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return months.map(month => ({ month, amount: 1000, paid: 0, due: 1000, status: "Unpaid" }));
    };
    const feeRecords = dbStudents.map(student => ({
      studentId: student._id,
      totalFee: 12000,
      totalPaid: 0,
      totalDue: 12000,
      status: "Unpaid",
      monthlyDetails: generateDefaultMonthlyDetails()
    }));
    await Fee.insertMany(feeRecords);
    console.log(`Seeded ${feeRecords.length} fees successfully.`);

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

    // Seed Classes
    await ClassModel.deleteMany({});
    const mockClasses = [
      { name: "One", classNumeric: 1, teacherName: "Alisha Henry", note: "Class one" },
      { name: "Two", classNumeric: 2, teacherName: "Jordan Mitchell", note: "Class two" },
      { name: "Three", classNumeric: 3, teacherName: "Jordan Mitchell", note: "Class three" },
      { name: "Four", classNumeric: 4, teacherName: "Maisie Pollard", note: "Class four" },
      { name: "Five", classNumeric: 5, teacherName: "Mia O'Donnell", note: "Class five" },
      { name: "Graduate", classNumeric: 6, teacherName: "Naomi Doyle", note: "Class graduate" }
    ];
    await ClassModel.insertMany(mockClasses);
    console.log(`Seeded ${mockClasses.length} classes successfully.`);

    // Seed Sections
    await SectionModel.deleteMany({});
    const mockSections = [
      { name: "A", category: "Academic", capacity: 40, className: "One", teacherName: "Alisha Henry", note: "Section A" },
      { name: "B", category: "Academic", capacity: 35, className: "One", teacherName: "John Doe", note: "Section B" },
      { name: "A", category: "Academic", capacity: 45, className: "Two", teacherName: "Jordan Mitchell", note: "Section A" },
      { name: "A", category: "Academic", capacity: 40, className: "Three", teacherName: "Emma Watson", note: "Section A" },
      { name: "B", category: "Academic", capacity: 50, className: "Three", teacherName: "Bruce Wayne", note: "Section B" }
    ];
    await SectionModel.insertMany(mockSections);
    console.log(`Seeded ${mockSections.length} sections successfully.`);

    // Seed Subjects
    await SubjectModel.deleteMany({});
    const mockSubjects = [
      { name: "Mathematics", author: "R.D. Sharma", code: "MATH101", className: "One", teacherName: "Alisha Henry", passMark: 33, finalMark: 100 },
      { name: "English Grammar", author: "Wren & Martin", code: "ENG101", className: "One", teacherName: "Jordan Mitchell", passMark: 33, finalMark: 100 },
      { name: "Science", author: "NCERT", code: "SCI101", className: "One", teacherName: "Maisie Pollard", passMark: 33, finalMark: 100 },
      { name: "Mathematics II", author: "R.D. Sharma", code: "MATH201", className: "Two", teacherName: "Alisha Henry", passMark: 33, finalMark: 100 },
      { name: "Social Studies", author: "Oxford", code: "SST201", className: "Two", teacherName: "Mia O'Donnell", passMark: 33, finalMark: 100 }
    ];
    await SubjectModel.insertMany(mockSubjects);
    console.log(`Seeded ${mockSubjects.length} subjects successfully.`);

    // Seed Syllabuses
    await SyllabusModel.deleteMany({});
    const mockSyllabuses = [
      { title: "First Term Science Syllabus", description: "Chapters 1 to 5 covering basic physics & chemistry concepts", date: "02 Aug 2026", uploader: "Admin", file: "syllabus_term1_science.pdf", className: "One" },
      { title: "Mid-Term Mathematics Syllabus", description: "Algebra, Geometry and Arithmetic basics", date: "01 Aug 2026", uploader: "Alisha Henry", file: "math_midterm.pdf", className: "One" },
      { title: "English Literature Outline", description: "Stories, Poems and Essay writing topics", date: "28 Jul 2026", uploader: "Jordan Mitchell", file: "english_syllabus.pdf", className: "Two" }
    ];
    await SyllabusModel.insertMany(mockSyllabuses);
    console.log(`Seeded ${mockSyllabuses.length} syllabuses successfully.`);

    // Seed Assignments
    await AssignmentModel.deleteMany({});
    const mockAssignments = [
      {
        title: "Algebra Worksheet #1",
        description: "Solve problems from chapter 3 exercises 1 to 15",
        deadline: "15 Aug 2026",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        uploader: "Alisha Henry",
        file: "algebra_worksheet1.pdf"
      },
      {
        title: "English Grammar Essay",
        description: "Write an essay of 250 words on 'My Favorite Season'",
        deadline: "18 Aug 2026",
        className: "One",
        sectionName: "B",
        subjectName: "English Grammar",
        uploader: "Jordan Mitchell",
        file: "essay_instructions.pdf"
      },
      {
        title: "Science Experiment Report",
        description: "Prepare a lab report on plant photosynthesis experiment",
        deadline: "20 Aug 2026",
        className: "Two",
        sectionName: "A",
        subjectName: "Science",
        uploader: "Admin",
        file: "lab_report_format.pdf"
      }
    ];
    await AssignmentModel.insertMany(mockAssignments);
    console.log(`Seeded ${mockAssignments.length} assignments successfully.`);

    // Seed Routines
    await RoutineModel.deleteMany({});
    const mockRoutines = [
      {
        schoolYear: "2025-2026 (Default)",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        day: "Monday",
        teacherName: "Alisha Henry",
        startingTime: "08:45 AM",
        endingTime: "09:30 AM",
        room: "101"
      },
      {
        schoolYear: "2025-2026 (Default)",
        className: "One",
        sectionName: "A",
        subjectName: "English Grammar",
        day: "Monday",
        teacherName: "Jordan Mitchell",
        startingTime: "09:30 AM",
        endingTime: "10:15 AM",
        room: "101"
      },
      {
        schoolYear: "2025-2026 (Default)",
        className: "Two",
        sectionName: "A",
        subjectName: "Science",
        day: "Tuesday",
        teacherName: "Maisie Pollard",
        startingTime: "10:30 AM",
        endingTime: "11:15 AM",
        room: "102"
      }
    ];
    await RoutineModel.insertMany(mockRoutines);
    console.log(`Seeded ${mockRoutines.length} routines successfully.`);

    // Seed Exams
    await ExamModel.deleteMany({});
    const mockExams = [
      { name: "First Semester", date: "01 Jan 2025", note: "Don't delete it!" },
      { name: "Second Semester", date: "01 Mar 2025", note: "" },
      { name: "Third Semester", date: "31 Dec 2025", note: "" }
    ];
    await ExamModel.insertMany(mockExams);
    console.log(`Seeded ${mockExams.length} exams successfully.`);

    // Seed Exam Schedules
    await ExamScheduleModel.deleteMany({});
    const mockExamSchedules = [
      {
        examName: "First Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        date: "10 Jan 2025",
        time: "09:00 AM - 12:00 PM",
        room: "101"
      },
      {
        examName: "First Semester",
        className: "One",
        sectionName: "B",
        subjectName: "English Grammar",
        date: "12 Jan 2025",
        time: "09:00 AM - 12:00 PM",
        room: "102"
      },
      {
        examName: "Second Semester",
        className: "Two",
        sectionName: "A",
        subjectName: "Science",
        date: "05 Mar 2025",
        time: "10:00 AM - 01:00 PM",
        room: "103"
      }
    ];
    await ExamScheduleModel.insertMany(mockExamSchedules);
    console.log(`Seeded ${mockExamSchedules.length} exam schedules successfully.`);

    // Seed Grades
    await GradeModel.deleteMany({});
    const mockGrades = [
      { gradeName: "A+", gradePoint: "5.00", markFrom: 80, markUpto: 100, note: "Excellent" },
      { gradeName: "A", gradePoint: "4.00", markFrom: 70, markUpto: 79, note: "Well Done" },
      { gradeName: "A-", gradePoint: "3.50", markFrom: 60, markUpto: 69, note: "Not bad but need to focus more" },
      { gradeName: "B", gradePoint: "3.00", markFrom: 50, markUpto: 59, note: "Average" },
      { gradeName: "C", gradePoint: "2.50", markFrom: 40, markUpto: 49, note: "Below Average" },
      { gradeName: "D", gradePoint: "2.00", markFrom: 33, markUpto: 39, note: "Bad" },
      { gradeName: "F", gradePoint: "0.00", markFrom: 0, markUpto: 32, note: "Very Bad" }
    ];
    await GradeModel.insertMany(mockGrades);
    console.log(`Seeded ${mockGrades.length} grades successfully.`);

    // Seed Exam Attendances
    await ExamAttendanceModel.deleteMany({});
    const mockExamAttendances = [
      {
        examName: "First Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        studentName: "John Doe",
        roll: "101",
        email: "john@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        status: "Present"
      },
      {
        examName: "First Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        studentName: "Jane Smith",
        roll: "102",
        email: "jane@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        status: "Absent"
      },
      {
        examName: "First Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Mathematics",
        studentName: "Michael Brown",
        roll: "103",
        email: "michael@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        status: "Late"
      }
    ];
    await ExamAttendanceModel.insertMany(mockExamAttendances);
    console.log(`Seeded ${mockExamAttendances.length} exam attendances successfully.`);

    // Seed Marks
    await MarkModel.deleteMany({});
    const mockMarks = [
      {
        examName: "Second Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Bangla",
        studentName: "Brady Harris",
        roll: "1",
        email: "brady@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brady",
        examMark: 30,
        attendanceMark: 4,
        classTestMark: 5,
        assignmentMark: 8,
        totalMark: 47
      },
      {
        examName: "Second Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Bangla",
        studentName: "Demi Wilson",
        roll: "2",
        email: "demi@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demi",
        examMark: 19,
        attendanceMark: 8,
        classTestMark: 0,
        assignmentMark: 1,
        totalMark: 28
      },
      {
        examName: "Second Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Bangla",
        studentName: "Kade Watson",
        roll: "3",
        email: "kade@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kade",
        examMark: 54,
        attendanceMark: 7,
        classTestMark: 9,
        assignmentMark: 2,
        totalMark: 72
      },
      {
        examName: "Second Semester",
        className: "One",
        sectionName: "A",
        subjectName: "Bangla",
        studentName: "August Fowler",
        roll: "4",
        email: "august@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=August",
        examMark: 9,
        attendanceMark: 9,
        classTestMark: 5,
        assignmentMark: 10,
        totalMark: 33
      }
    ];
    await MarkModel.insertMany(mockMarks);
    console.log(`Seeded ${mockMarks.length} marks successfully.`);

    // Seed Mark Distributions
    await MarkDistributionModel.deleteMany({});
    const mockMarkDistributions = [
      { markDistributionType: "Exam", markValue: 70 },
      { markDistributionType: "Attendance", markValue: 10 },
      { markDistributionType: "Class Test", markValue: 10 },
      { markDistributionType: "Assignment", markValue: 10 },
      { markDistributionType: "Practical", markValue: 10 },
      { markDistributionType: "Quiz Test", markValue: 10 },
      { markDistributionType: "Lab Report", markValue: 10 },
      { markDistributionType: "Exam", markValue: 100 },
      { markDistributionType: "Exam", markValue: 30 },
      { markDistributionType: "Exam", markValue: 40 }
    ];
    await MarkDistributionModel.insertMany(mockMarkDistributions);
    console.log(`Seeded ${mockMarkDistributions.length} mark distributions successfully.`);

    // Seed Promotion Setting
    await PromotionSettingModel.deleteMany({});
    const mockPromotionSetting = {
      academicYear: "2025-2026",
      className: "One",
      promotionAcademicYear: "2026-2027",
      promotionClassName: "Two",
      promotionType: "Normal",
      selectedExams: ["First Semester", "Second Semester", "Third Semester"],
      subjectPassMarks: {
        English: 33,
        Bangla: 33,
        Drawing: 33,
        "Math Matrix": 33,
        Science: 25,
        Math: 33,
        ICT: 33,
      },
    };
    await PromotionSettingModel.create(mockPromotionSetting);
    console.log("Seeded promotion setting successfully.");

    console.log("Database Seeding Completed Successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Database Seeding Failed:", error);
    process.exit(1);
  }
};

seedDB();
