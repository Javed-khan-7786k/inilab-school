import RoutineModel from "../models/RoutineModel.js";
import ApiError from "../utils/ApiError.js";

class RoutineService {
  async getAll(query = {}) {
    const { className, search, page = 1, limit = 100, sortBy = "day", sortOrder = "asc" } = query;
    const filter = {};

    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { schoolYear: { $regex: search, $options: "i" } },
        { className: { $regex: search, $options: "i" } },
        { sectionName: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } },
        { day: { $regex: search, $options: "i" } },
        { teacherName: { $regex: search, $options: "i" } },
        { room: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await RoutineModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await RoutineModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await RoutineModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Routine not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new RoutineModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await RoutineModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Routine not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await RoutineModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Routine not found");
    }
    return true;
  }
}

export default new RoutineService();
