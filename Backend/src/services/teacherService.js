import Teacher from "../models/Teacher.js";
import ApiError from "../utils/ApiError.js";

class TeacherService {
  async getAll(query) {
    const { search, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await Teacher.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true });

    const total = await Teacher.countDocuments(filter);

    return {
      data: data.map(item => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const teacher = await Teacher.findById(id).lean({ virtuals: true });
    if (!teacher) {
      throw ApiError.notFound("Teacher not found");
    }
    return { ...teacher, id: teacher._id.toString() };
  }

  async create(data) {
    const teacher = new Teacher(data);
    await teacher.save();
    return teacher;
  }

  async update(id, data) {
    const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!teacher) {
      throw ApiError.notFound("Teacher not found");
    }
    return teacher;
  }

  async delete(id) {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      throw ApiError.notFound("Teacher not found");
    }
    return teacher;
  }
}

export default new TeacherService();
