import Notice from "../models/Notice.js";
import ApiError from "../utils/ApiError.js";

class NoticeService {
  async getAll() {
    const data = await Notice.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async getById(id) {
    const notice = await Notice.findById(id).lean();
    if (!notice) {
      throw ApiError.notFound("Notice not found");
    }
    return { ...notice, id: notice._id.toString() };
  }

  async create(data) {
    const notice = new Notice(data);
    await notice.save();
    return notice;
  }

  async update(id, data) {
    const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
    if (!notice) {
      throw ApiError.notFound("Notice not found");
    }
    return notice;
  }

  async delete(id) {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      throw ApiError.notFound("Notice not found");
    }
    return notice;
  }
}

export default new NoticeService();
