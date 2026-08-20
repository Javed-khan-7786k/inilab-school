function escapeRegex(text) {
  return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : "";
}

class ExamAttendanceService {
  async getAll(query = {}) {
    const { examName, className, sectionName, subjectName, search, page = 1, limit = 100 } = query;
    const filter = {};

    if (examName) {
      filter.examName = { $regex: new RegExp(`^${escapeRegex(examName)}$`, "i") };
    }
    if (className) {
      filter.className = { $regex: new RegExp(`^${escapeRegex(className)}$`, "i") };
    }
    if (sectionName) {
      filter.sectionName = { $regex: new RegExp(`^${escapeRegex(sectionName)}$`, "i") };
    }
    if (subjectName) {
      filter.subjectName = { $regex: new RegExp(`^${escapeRegex(subjectName)}$`, "i") };
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { studentName: { $regex: safeSearch, $options: "i" } },
        { roll: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { status: { $regex: safeSearch, $options: "i" } },
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
      const { examName, className, sectionName, subjectName, studentName, studentId, roll } = record;
      
      const queryFilter = {
        examName,
        className,
        subjectName,
      };
      if (studentId) {
        queryFilter.studentId = studentId;
      } else if (studentName) {
        queryFilter.studentName = studentName;
      }
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
