import ExamScheduleModel from "../models/ExamScheduleModel.js";
import ApiError from "../utils/ApiError.js";

class ExamScheduleService {
  async getAll(query = {}) {
    const { className, search, page = 1, limit = 100, sortBy = "date", sortOrder = "asc" } = query;
    const filter = {};

    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { examName: { $regex: search, $options: "i" } },
        { className: { $regex: search, $options: "i" } },
        { sectionName: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
        { time: { $regex: search, $options: "i" } },
        { room: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await ExamScheduleModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await ExamScheduleModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await ExamScheduleModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Exam schedule not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new ExamScheduleModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await ExamScheduleModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Exam schedule not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await ExamScheduleModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Exam schedule not found");
    }
    return true;
  }
}

export default new ExamScheduleService();
