import MarkDistributionModel from "../models/MarkDistributionModel.js";
import ApiError from "../utils/ApiError.js";

class MarkDistributionService {
  async getAll(query = {}) {
    const { search, page = 1, limit = 100 } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { markDistributionType: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const data = await MarkDistributionModel.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await MarkDistributionModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await MarkDistributionModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Mark distribution not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = await MarkDistributionModel.create(data);
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await MarkDistributionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Mark distribution not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await MarkDistributionModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Mark distribution not found");
    }
    return true;
  }
}

export default new MarkDistributionService();
