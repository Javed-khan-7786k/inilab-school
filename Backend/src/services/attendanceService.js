import Attendance from "../models/Attendance.js";
import smsService from "./smsService.js";

class AttendanceService {
  async getByDate(date, className) {
    const filter = { date };
    if (className) {
      filter.className = className;
    }

    const records = await Attendance.find(filter)
      .populate("studentId", "name roll photo className")
      .lean({ virtuals: true });

    return records.map((item) => ({
      ...item,
      id: item._id.toString(),
      studentId: item.studentId?._id?.toString() || item.studentId,
      teacherId: item.teacherId?._id?.toString() || item.teacherId,
      userId: item.userId?._id?.toString() || item.userId,
    }));
  }

  async getByUserAndMonth(type, id, month) {
    const start = `${month}-01`;
    const end = `${month}-31`;

    const filter = {
      date: { $gte: start, $lte: end }
    };

    if (type === "student") filter.studentId = id;
    else if (type === "teacher") filter.teacherId = id;
    else filter.userId = id;

    const records = await Attendance.find(filter).lean();
    return records.map(r => ({
      ...r,
      id: r._id.toString()
    }));
  }

  async saveBatch(date, records, userId) {
    if (!date) {
      throw new Error("Date is required to save attendance");
    }

    const bulkOps = records.map((item) => ({
      updateOne: {
        filter: { studentId: item.studentId, date },
        update: {
          $set: {
            studentId: item.studentId,
            date,
            status: item.status || "Present",
            className: item.className || "",
            remarks: item.remarks || "",
            createdBy: userId,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);

      // Asynchronously trigger automated absence SMS alert for absent students
      const absentItems = records.filter((r) => r.status === "Absent");
      if (absentItems.length > 0) {
        Promise.all(
          absentItems.map((item) =>
            smsService.sendAbsenceAlert({
              studentName: item.studentName || "Student",
              className: item.className || "",
              date,
            }).catch((e) => console.error("Auto SMS Error:", e))
          )
        ).catch(() => {});
      }
    }

    return this.getByDate(date);
  }

  async getStaffByDate(date) {
    const filter = { date, userId: { $exists: true, $ne: null } };
    const records = await Attendance.find(filter)
      .populate("userId", "name email role photo")
      .lean({ virtuals: true });

    return records.map((item) => ({
      ...item,
      id: item._id.toString(),
      userId: item.userId?._id?.toString() || item.userId,
      userInfo: item.userId && typeof item.userId === "object" ? item.userId : null,
    }));
  }

  async saveStaffBatch(date, records, user) {
    if (!date) {
      throw new Error("Date is required to save staff attendance");
    }

    const existingCount = await Attendance.countDocuments({
      date,
      userId: { $exists: true, $ne: null },
    });

    const userRole = user?.role || "";
    // If staff attendance already exists for this date, only Admin can modify/edit it!
    if (existingCount > 0 && userRole !== "Admin") {
      throw new Error("Staff attendance for this date has already been submitted. Only Admin can edit saved records.");
    }

    const bulkOps = records.map((item) => ({
      updateOne: {
        filter: { userId: item.userId, date },
        update: {
          $set: {
            userId: item.userId,
            date,
            status: item.status || "Present",
            remarks: item.remarks || "",
            createdBy: user?._id,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    return this.getStaffByDate(date);
  }
}

export default new AttendanceService();
