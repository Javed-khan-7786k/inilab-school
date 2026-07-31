import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";

class EventService {
  async getAll() {
    const data = await Event.find({}).sort({ createdAt: -1 }).lean();
    return data.map(item => ({ ...item, id: item._id.toString() }));
  }

  async getById(id) {
    const event = await Event.findById(id).lean();
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    return { ...event, id: event._id.toString() };
  }

  async create(data) {
    const event = new Event(data);
    await event.save();
    return event;
  }

  async update(id, data) {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    return event;
  }

  async delete(id) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    return event;
  }
}

export default new EventService();
