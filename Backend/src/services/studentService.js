import fs from "fs";
import path from "path";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";

// Helper to decode base64 and save to uploads folder
const saveBase64Image = (base64Str, prefix = "student-photo") => {
  if (!base64Str || !base64Str.startsWith("data:image/")) {
    return base64Str; // Return unchanged if not base64
  }

  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  let ext = "png";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
  else if (mimeType.includes("gif")) ext = "gif";
  else if (mimeType.includes("webp")) ext = "webp";

  const uploadDir = path.resolve("uploads", "images");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
  return `${baseUrl}/uploads/images/${fileName}`;
};

class StudentService {
  async getAll(query) {
    const { search, className, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    const filter = {};

    if (className) {
      filter.className = className;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { roll: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await Student.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true });

    const total = await Student.countDocuments(filter);

    return {
      data: data.map(item => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const student = await Student.findById(id).lean({ virtuals: true });
    if (!student) {
      throw ApiError.notFound("Student not found");
    }
    return { ...student, id: student._id.toString() };
  }

  async create(data) {
    let photoUrl = data.photo || "https://demo.eduking.xyz/uploads/images/default.png";
    if (data.photo && data.photo.startsWith("data:image/")) {
      try {
        photoUrl = saveBase64Image(data.photo);
      } catch (err) {
        console.error("Error saving student photo:", err);
      }
    }

    const student = new Student({ ...data, photo: photoUrl });
    await student.save();
    return student;
  }

  async update(id, data) {
    const existing = await Student.findById(id);
    if (!existing) {
      throw ApiError.notFound("Student not found");
    }

    let photoUrl = existing.photo;
    if (data.photo && data.photo !== existing.photo && data.photo.startsWith("data:image/")) {
      try {
        photoUrl = saveBase64Image(data.photo);
      } catch (err) {
        console.error("Error saving student photo:", err);
      }
      data = { ...data, photo: photoUrl };
    }

    const student = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!student) {
      throw ApiError.notFound("Student not found");
    }
    return student;
  }

  async delete(id) {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }
    return student;
  }
}

export default new StudentService();