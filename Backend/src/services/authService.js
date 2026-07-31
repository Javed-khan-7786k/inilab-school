import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      throw ApiError.badRequest("Username already exists");
    }
    const user = new User(userData);
    await user.save();
    return user;
  }

  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw ApiError.unauthorized("Invalid username or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  async getMe(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }
}

export default new AuthService();
