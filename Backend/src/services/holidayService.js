import Holiday from "../models/Holiday.js";
import ApiError from "../utils/ApiError.js";

class HolidayService {
  async getAll() {
    const data = await Holiday.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async getById(id) {
    const holiday = await Holiday.findById(id).lean();
    if (!holiday) {
      throw ApiError.notFound("Holiday not found");
    }
    return { ...holiday, id: holiday._id.toString() };
  }

  async create(data) {
    const holiday = new Holiday(data);
    await holiday.save();
    return holiday;
  }

  async update(id, data) {
    const holiday = await Holiday.findByIdAndUpdate(id, data, { new: true });
    if (!holiday) {
      throw ApiError.notFound("Holiday not found");
    }
    return holiday;
  }

  async delete(id) {
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) {
      throw ApiError.notFound("Holiday not found");
    }
    return holiday;
  }
}

export default new HolidayService();
