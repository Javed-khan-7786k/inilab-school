import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Parent from "../models/Parent.js";
import Event from "../models/Event.js";
import Holiday from "../models/Holiday.js";
import Visitor from "../models/Visitor.js";
import Notice from "../models/Notice.js";
import User from "../models/User.js";

class DashboardService {
  async getDashboardData(role, username) {
    // 1. Fetch user profile from database
    const userProfile = await User.findOne({ username }).select("-password").lean();
    
    // 2. Fetch latest notices from database
    const dbNotices = await Notice.find({}).sort({ createdAt: -1 }).limit(5).lean();
    const noticesData = dbNotices.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      description: n.notice.length > 50 ? n.notice.slice(0, 50) + ".." : n.notice,
      actionHref: "#",
    }));

    // Standard calendar data from mock static constants
    const calendarData = {
      calendarMonth: "July",
      calendarYear: 2026,
      calendarTodayDate: 8,
      calendarDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarWeeks: [
        [
          { day: 28, isOtherMonth: true },
          { day: 29, isOtherMonth: true },
          { day: 30, isOtherMonth: true },
          { day: 1 },
          { day: 2 },
          { day: 3 },
          { day: 4 },
        ],
        [
          { day: 5 },
          { day: 6 },
          { day: 7 },
          { day: 8, isToday: true },
          { day: 9 },
          { day: 10 },
          { day: 11 },
        ],
        [
          { day: 12 },
          { day: 13 },
          { day: 14 },
          { day: 15 },
          { day: 16 },
          { day: 17 },
          { day: 18 },
        ],
        [
          { day: 19 },
          { day: 20 },
          { day: 21 },
          { day: 22 },
          { day: 23 },
          { day: 24 },
          { day: 25 },
        ],
        [
          { day: 26 },
          { day: 27 },
          { day: 28 },
          { day: 29 },
          { day: 30 },
          { day: 31 },
          { day: 1, isOtherMonth: true },
        ],
        [
          { day: 2, isOtherMonth: true },
          { day: 3, isOtherMonth: true },
          { day: 4, isOtherMonth: true },
          { day: 5, isOtherMonth: true },
          { day: 6, isOtherMonth: true },
          { day: 7, isOtherMonth: true },
          { day: 8, isOtherMonth: true },
        ],
      ],
    };

    if (role === "Admin") {
      const studentCount = await Student.countDocuments({});
      const teacherCount = await Teacher.countDocuments({});
      const userCount = await User.countDocuments({});
      const visitorCount = await Visitor.countDocuments({});

      const infoBoxes = [
        { value: studentCount, label: "Student", icon: "fa-graduation-cap", bgColor: "bg-tealbox" },
        { value: teacherCount, label: "Teacher", icon: "fa-user", bgColor: "bg-orangebox" },
        { value: userCount, label: "User", icon: "fa-users", bgColor: "bg-pinkbox" },
        { value: visitorCount, label: "Visitor Log", icon: "fa-user-secret", bgColor: "bg-purplebox" },
      ];

      return {
        profileUser: {
          name: userProfile?.name || "System Admin",
          role: "Admin",
          avatarUrl: userProfile?.photo || "https://demo.eduking.xyz/uploads/images/default.png",
        },
        profileDetails: [
          { icon: "fa-user", label: "Username", value: userProfile?.username || "admin" },
          { icon: "fa-envelope", label: "Email", value: userProfile?.email || "admin@example.com" },
          { icon: "fa-phone", label: "Phone", value: userProfile?.phone || "+44071 2345 6789" },
          { icon: "fa-globe", label: "Address", value: userProfile?.address || "Main Admin Office, Education Campus" },
        ],
        infoBoxes,
        notices: noticesData.length > 0 ? noticesData : [
          { id: 1, title: "Farewell Ceremony", description: "The most of the words adopted by the Russian langu..", actionHref: "#" }
        ],
        ...calendarData,
      };
    } else if (role === "Receptionist") {
      const teacherCount = await Teacher.countDocuments({});
      const eventCount = await Event.countDocuments({});
      const holidayCount = await Holiday.countDocuments({});
      const visitorCount = await Visitor.countDocuments({});

      const infoBoxes = [
        { value: teacherCount, label: "Teacher", icon: "fa-user", bgColor: "bg-orangebox" },
        { value: eventCount, label: "Event", icon: "fa-calendar-check-o", bgColor: "bg-tealbox" },
        { value: holidayCount, label: "Holiday", icon: "fa-umbrella", bgColor: "bg-pinkbox" },
        { value: visitorCount, label: "Visitor Information", icon: "fa-user-secret", bgColor: "bg-purplebox" },
      ];

      return {
        profileUser: {
          name: userProfile?.name || "User 2",
          role: "Receptionist",
          avatarUrl: userProfile?.photo || "https://demo.eduking.xyz/uploads/images/default.png",
        },
        profileDetails: [
          { icon: "fa-user", label: "Username", value: userProfile?.username || "receptionist" },
          { icon: "fa-envelope", label: "Email", value: userProfile?.email || "user2@example.com" },
          { icon: "fa-phone", label: "Phone", value: userProfile?.phone || "+44079 0532 3213" },
          { icon: "fa-globe", label: "Address", value: userProfile?.address || "38 Worthy Lane MAVESYN RIDWARE WS15 0QS" },
        ],
        infoBoxes,
        notices: noticesData.length > 0 ? noticesData : [
          { id: 1, title: "Farewell Ceremony", description: "The most of the words adopted by the Russian langu..", actionHref: "#" }
        ],
        ...calendarData,
      };
    } else {
      // Default to Librarian
      const teacherCount = await Teacher.countDocuments({});
      // Librarian specifics (Books, Members, Issue) can be mocked or counted if collections exist.
      const infoBoxes = [
        { value: teacherCount, label: "Teacher", icon: "fa-user", bgColor: "bg-orangebox" },
        { value: 5, label: "Member", icon: "fa-user-plus", bgColor: "bg-tealbox" },
        { value: 5, label: "Books", icon: "fa-graduation-cap", bgColor: "bg-pinkbox" },
        { value: 1, label: "Issue", icon: "fa-shopping-cart", bgColor: "bg-purplebox" },
      ];

      return {
        profileUser: {
          name: userProfile?.name || "User 3",
          role: "Librarian",
          avatarUrl: userProfile?.photo || "https://demo.eduking.xyz/uploads/images/default.png",
        },
        profileDetails: [
          { icon: "fa-user", label: "Username", value: userProfile?.username || "librarian" },
          { icon: "fa-envelope", label: "Email", value: userProfile?.email || "user3@example.com" },
          { icon: "fa-phone", label: "Phone", value: userProfile?.phone || "+44078 0833 2765" },
          { icon: "fa-globe", label: "Address", value: userProfile?.address || "92 Sea Road LAMINGTON ML12 7DA" },
        ],
        infoBoxes,
        notices: noticesData.length > 0 ? noticesData : [
          { id: 1, title: "Farewell Ceremony", description: "The most of the words adopted by the Russian langu..", actionHref: "#" }
        ],
        ...calendarData,
      };
    }
  }
}

export default new DashboardService();
