import Visitor from "../models/Visitor.js";
import ApiError from "../utils/ApiError.js";

class VisitorService {
  async getAll() {
    const data = await Visitor.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async getById(id) {
    const visitor = await Visitor.findById(id).lean();
    if (!visitor) {
      throw ApiError.notFound("Visitor not found");
    }
    return { ...visitor, id: visitor._id.toString() };
  }

  async create(data) {
    const count = await Visitor.countDocuments({});
    const newVisitorId = String(count + 1);

    const now = new Date();
    // Offset local date string creation to match YYYY-MM-DD HH:MM:SS format
    const pad = (num) => String(num).padStart(2, "0");
    const checkInStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const visitorData = {
      ...data,
      visitorId: newVisitorId,
      checkIn: checkInStr,
      checkOut: data.status === "out" ? checkInStr : "",
      status: data.status || "in",
    };

    const visitor = new Visitor(visitorData);
    await visitor.save();
    return visitor;
  }

  async checkout(id) {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    const checkOutStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { status: "out", checkOut: checkOutStr },
      { new: true }
    );

    if (!visitor) {
      throw ApiError.notFound("Visitor not found");
    }
    return visitor;
  }

  async delete(id) {
    const visitor = await Visitor.findByIdAndDelete(id);
    if (!visitor) {
      throw ApiError.notFound("Visitor not found");
    }
    return visitor;
  }
}

export default new VisitorService();
