import Leave from "../models/Leave.js";
import ApiError from "../utils/ApiError.js";

class LeaveService {
  async getAll() {
    const data = await Leave.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async create(data) {
    const today = new Date().toISOString().split("T")[0];
    const scheduleStr = data.schedule || `${today} to ${today}`;

    const leaveData = {
      applicationTo: data.applicationTo || "Principal",
      category: data.category || "Casual Leave",
      date: today,
      schedule: scheduleStr,
      days: data.days || 1,
      attachment: data.attachment || "-",
      status: "Pending",
    };

    const leave = new Leave(leaveData);
    await leave.save();
    return leave;
  }

  async updateStatus(id, status) {
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) {
      throw ApiError.notFound("Leave application not found");
    }
    return leave;
  }

  async delete(id) {
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      throw ApiError.notFound("Leave application not found");
    }
    return leave;
  }
}

export default new LeaveService();
