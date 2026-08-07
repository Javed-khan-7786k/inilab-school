import SectionModel from "../models/SectionModel.js";
import ApiError from "../utils/ApiError.js";

class SectionService {
  async getAll(query = {}) {
    const { className, search, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    const filter = {};

    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { className: { $regex: search, $options: "i" } },
        { teacherName: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await SectionModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await SectionModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await SectionModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Section not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new SectionModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await SectionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Section not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await SectionModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Section not found");
    }
    return true;
  }
}

export default new SectionService();
