import ExamModel from "../models/ExamModel.js";
import ApiError from "../utils/ApiError.js";

class ExamService {
  async getAll(query = {}) {
    const { search, page = 1, limit = 100, sortBy = "createdAt", sortOrder = "asc" } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await ExamModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await ExamModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await ExamModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Exam not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new ExamModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await ExamModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Exam not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await ExamModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Exam not found");
    }
    return true;
  }
}

export default new ExamService();
