import GradeModel from "../models/GradeModel.js";
import ApiError from "../utils/ApiError.js";

class GradeService {
  async getAll(query = {}) {
    const { search, page = 1, limit = 100, sortBy = "markFrom", sortOrder = "desc" } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { gradeName: { $regex: search, $options: "i" } },
        { gradePoint: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const data = await GradeModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await GradeModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await GradeModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Grade not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new GradeModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await GradeModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Grade not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await GradeModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Grade not found");
    }
    return true;
  }
}

export default new GradeService();
