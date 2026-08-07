import AssignmentModel from "../models/AssignmentModel.js";
import ApiError from "../utils/ApiError.js";

class AssignmentService {
  async getAll(query = {}) {
    const { className, search, page = 1, limit = 100, sortBy = "createdAt", sortOrder = "desc" } = query;
    const filter = {};

    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { className: { $regex: search, $options: "i" } },
        { sectionName: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } },
        { uploader: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await AssignmentModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await AssignmentModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await AssignmentModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Assignment not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new AssignmentModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await AssignmentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Assignment not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await AssignmentModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Assignment not found");
    }
    return true;
  }
}

export default new AssignmentService();
