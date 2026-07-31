import Parent from "../models/Parent.js";
import ApiError from "../utils/ApiError.js";

class ParentService {
  async getAll(query) {
    const { search, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await Parent.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true });

    const total = await Parent.countDocuments(filter);

    return {
      data: data.map(item => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const parent = await Parent.findById(id).lean({ virtuals: true });
    if (!parent) {
      throw ApiError.notFound("Parent not found");
    }
    return { ...parent, id: parent._id.toString() };
  }

  async create(data) {
    const parent = new Parent(data);
    await parent.save();
    return parent;
  }

  async update(id, data) {
    const parent = await Parent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!parent) {
      throw ApiError.notFound("Parent not found");
    }
    return parent;
  }

  async delete(id) {
    const parent = await Parent.findByIdAndDelete(id);
    if (!parent) {
      throw ApiError.notFound("Parent not found");
    }
    return parent;
  }
}

export default new ParentService();
