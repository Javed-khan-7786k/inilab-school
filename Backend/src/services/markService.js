import MarkModel from "../models/MarkModel.js";
import ApiError from "../utils/ApiError.js";

class MarkService {
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
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const data = await MarkModel.find(filter)
      .sort({ roll: 1, studentName: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await MarkModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await MarkModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Mark record not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async saveBulk(markRecords = []) {
    const results = [];
    for (const record of markRecords) {
      const {
        examName,
        className,
        sectionName,
        subjectName,
        studentName,
        examMark = 0,
        attendanceMark = 0,
        classTestMark = 0,
        assignmentMark = 0,
      } = record;

      const totalMark =
        Number(examMark || 0) +
        Number(attendanceMark || 0) +
        Number(classTestMark || 0) +
        Number(assignmentMark || 0);

      const payload = {
        ...record,
        examMark: Number(examMark),
        attendanceMark: Number(attendanceMark),
        classTestMark: Number(classTestMark),
        assignmentMark: Number(assignmentMark),
        totalMark,
      };

      const queryFilter = {
        examName,
        className,
        subjectName,
        studentName,
      };
      if (sectionName) queryFilter.sectionName = sectionName;

      const updated = await MarkModel.findOneAndUpdate(queryFilter, payload, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      results.push(updated);
    }
    return results;
  }

  async update(id, data) {
    if (
      data.examMark !== undefined ||
      data.attendanceMark !== undefined ||
      data.classTestMark !== undefined ||
      data.assignmentMark !== undefined
    ) {
      const existing = await MarkModel.findById(id).lean();
      if (existing) {
        const eMark = data.examMark !== undefined ? Number(data.examMark) : existing.examMark;
        const aMark = data.attendanceMark !== undefined ? Number(data.attendanceMark) : existing.attendanceMark;
        const cMark = data.classTestMark !== undefined ? Number(data.classTestMark) : existing.classTestMark;
        const asMark = data.assignmentMark !== undefined ? Number(data.assignmentMark) : existing.assignmentMark;
        data.totalMark = eMark + aMark + cMark + asMark;
      }
    }

    const item = await MarkModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Mark record not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await MarkModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Mark record not found");
    }
    return true;
  }
}

export default new MarkService();
