import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class UserService {
  async getAll(query) {
    const { search, page = 1, limit = 100, sortBy = "name", sortOrder = "asc" } = query;
    
    // In our MERN setup, a "UserItem" in the UserPage corresponds to staff/system users (Accountant, Librarian, Receptionist, Moderator, etc.)
    // But to be flexible, we can fetch all users or filter by non-student/non-parent.
    // Let's filter to retrieve users whose role is Librarian, Receptionist, Accountant, Moderator, Admin
    const filter = {
      role: { $in: ["Librarian", "Receptionist", "Accountant", "Moderator", "Admin"] }
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const data = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select("name email role photo username")
      .lean();

    const total = await User.countDocuments(filter);

    return {
      data: data.map(item => ({ ...item, id: item._id.toString() })),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async getById(id) {
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return { ...user, id: user._id.toString() };
  }

  async getByUsername(username) {
    const user = await User.findOne({ username }).select("-password").lean();
    if (!user) {
      throw ApiError.notFound("User profile not found");
    }
    return { ...user, id: user._id.toString() };
  }

  async create(data) {
    const user = new User(data);
    await user.save();
    return user;
  }

  async update(id, data) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }

  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }
}

export default new UserService();
