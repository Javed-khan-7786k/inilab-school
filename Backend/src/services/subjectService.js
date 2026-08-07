import SubjectModel from "../models/SubjectModel.js";
import ApiError from "../utils/ApiError.js";

class SubjectService {
  async getAll(query = {}) {
    const { className, search, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    const filter = {};

    if (className) {
      filter.className = { $regex: new RegExp(`^${className}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { className: { $regex: search, $options: "i" } },
        { teacherName: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    let total = await SubjectModel.countDocuments(filter);

    // Auto-seed default core subjects if DB is empty
    if (total === 0 && !search && !className) {
      const defaultSubjects = [
        { name: "Mathematics", code: "MATH-101", className: "Class 9", teacherName: "Dr. Amit Verma", passMark: 33, finalMark: 100, author: "NCERT" },
        { name: "Physics", code: "PHY-101", className: "Class 9", teacherName: "Dr. Amit Verma", passMark: 33, finalMark: 100, author: "HC Verma" },
        { name: "Chemistry", code: "CHEM-101", className: "Class 9", teacherName: "Mrs. Kavita Roy", passMark: 33, finalMark: 100, author: "NCERT" },
        { name: "Biology", code: "BIO-101", className: "Class 9", teacherName: "Mrs. Kavita Roy", passMark: 33, finalMark: 100, author: "NCERT" },
        { name: "English Core", code: "ENG-101", className: "Class 9", teacherName: "Mr. Rajesh Kumar", passMark: 33, finalMark: 100, author: "CBSE" },
        { name: "Hindi", code: "HIN-101", className: "Class 9", teacherName: "Ms. Sunita Sharma", passMark: 33, finalMark: 100, author: "NCERT" },
        { name: "Accountancy", code: "ACC-201", className: "Class 11", teacherName: "Mrs. Neha Mehta", passMark: 33, finalMark: 100, author: "TS Grewal" },
        { name: "Business Studies", code: "BST-201", className: "Class 11", teacherName: "Mrs. Neha Mehta", passMark: 33, finalMark: 100, author: "Poonam Gandhi" },
        { name: "Economics", code: "ECO-201", className: "Class 11", teacherName: "Mrs. Neha Mehta", passMark: 33, finalMark: 100, author: "TR Jain" },
        { name: "Computer Science", code: "CS-101", className: "Class 9", teacherName: "Prof. S. K. Gupta", passMark: 33, finalMark: 100, author: "Sumita Arora" },
      ];
      await SubjectModel.insertMany(defaultSubjects);
    }

    const data = await SubjectModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const updatedTotal = await SubjectModel.countDocuments(filter);

    return {
      data: data.map((item) => ({ ...item, id: item._id.toString() })),
      total: updatedTotal,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const item = await SubjectModel.findById(id).lean();
    if (!item) {
      throw ApiError.notFound("Subject not found");
    }
    return { ...item, id: item._id.toString() };
  }

  async create(data) {
    const item = new SubjectModel(data);
    await item.save();
    return { ...item.toObject(), id: item._id.toString() };
  }

  async update(id, data) {
    const item = await SubjectModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw ApiError.notFound("Subject not found");
    }
    return { ...item.toObject(), id: item._id.toString() };
  }

  async delete(id) {
    const item = await SubjectModel.findByIdAndDelete(id);
    if (!item) {
      throw ApiError.notFound("Subject not found");
    }
    return true;
  }
}

export default new SubjectService();
