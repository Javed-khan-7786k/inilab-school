import ExamAttendanceModel from "../models/ExamAttendanceModel.js";
import ApiError from "../utils/ApiError.js";

class ExamAttendanceService {
  async getAll(query = {}) {
    const { examName, className, sectionName, subjectName, search, page = 1, limit = 100 } = query;
    const filter = {};

    if (examName) {
      filter.examName = { $regex: new RegExp(`^${examName}$`, "i") };
    }
    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }
    if (sectionName) {
      filter.sectionName = { $regex: new RegExp(`^${sectionName}$`, "i") };
    }
    if (subjectName) {
      filter.subjectName = { $regex: new RegExp(`^${subjectName}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { roll: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const data = await ExamAttendanceModel.find(filter)
      .sort({ roll: 1, studentName: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await ExamAttendanceModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await ExamAttendanceModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Exam attendance entry not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async saveBulk(attendanceRecords = []) {
    const results = [];
    for (const record of attendanceRecords) {
      const { examName, className, sectionName, subjectName, studentName, roll } = record;
      
      const queryFilter = {
        examName,
        className,
        subjectName,
        studentName,
      };
      if (sectionName) queryFilter.sectionName = sectionName;

      const updated = await ExamAttendanceModel.findOneAndUpdate(
        queryFilter,
        record,
        { upsert: true, new: true, runValidators: true }
      );
      results.push(updated);
    }
    return results;
  }

  async update(id, data) {
    const item = await ExamAttendanceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Exam attendance entry not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await ExamAttendanceModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Exam attendance entry not found");
    }
    return true;
  }
}

export default new ExamAttendanceService();
