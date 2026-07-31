import fs from "fs";
import path from "path";
import Enquiry from "../models/Enquiry.js";
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

// Helper to delete locally saved photo
const deleteLocalFile = (photoPath) => {
  if (photoPath && (photoPath.startsWith("/uploads/") || photoPath.includes("/uploads/"))) {
    const relPath = photoPath.includes("/uploads/") ? photoPath.substring(photoPath.indexOf("/uploads/")) : photoPath;
    const filePath = path.join(path.resolve("."), relPath);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete local photo:", err);
      }
    }
  }
};

class EnquiryService {
  async getAll(query) {
    const { search, applyingClass, status, page = 1, limit = 100, sortBy = "createdAt", sortOrder = "desc" } = query;
    const filter = {};

    if (applyingClass) {
      filter.applyingClass = applyingClass;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { fatherName: { $regex: search, $options: "i" } },
        { fatherContact: { $regex: search, $options: "i" } },
        { motherContact: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await Enquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true });

    const total = await Enquiry.countDocuments(filter);

    return {
      data: data.map(item => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const enquiry = await Enquiry.findById(id).lean({ virtuals: true });
    if (!enquiry) {
      throw ApiError.notFound("Enquiry not found");
    }
    return { ...enquiry, id: enquiry._id.toString() };
  }

  async create(data, userId) {
    // Process image if any
    let photoUrl = "https://demo.eduking.xyz/uploads/images/default.png";
    if (data.photo) {
      try {
        photoUrl = saveBase64Image(data.photo);
      } catch (err) {
        console.error("Error saving student photo:", err);
      }
    }

    const enquiryData = {
      ...data,
      photo: photoUrl,
      createdBy: userId,
    };

    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();
    return enquiry;
  }

  async update(id, data) {
    // Get existing enquiry to check for image replacement/deletion
    const existing = await Enquiry.findById(id);
    if (!existing) {
      throw ApiError.notFound("Enquiry not found");
    }

    let photoUrl = existing.photo;
    // Process new image if provided and changed
    if (data.photo && data.photo !== existing.photo && data.photo.startsWith("data:image/")) {
      try {
        photoUrl = saveBase64Image(data.photo);
        // Clean up previous image if it was a local file
        deleteLocalFile(existing.photo);
      } catch (err) {
        console.error("Error updating student photo:", err);
      }
    } else if (data.photo === "") {
      // If photo was cleared, reset to default and delete previous
      photoUrl = "https://demo.eduking.xyz/uploads/images/default.png";
      deleteLocalFile(existing.photo);
    }

    const updateData = {
      ...data,
      photo: photoUrl,
    };

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return updatedEnquiry;
  }

  async delete(id) {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      throw ApiError.notFound("Enquiry not found");
    }
    // Clean up local photo
    deleteLocalFile(enquiry.photo);
    return enquiry;
  }
}

export default new EnquiryService();
