import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token expired"));
    }
    next(error);
  }
};

export default auth;
