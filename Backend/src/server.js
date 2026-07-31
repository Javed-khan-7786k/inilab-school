import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import ApiError from "./utils/ApiError.js";
import dns from 'dns'
dns.setServers(['8.8.8.8','8.8.4.4'])
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middlewares
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://inilab-school-beta.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api", apiLimiter);

// Serve static uploads
// Serve static uploads
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static("uploads"));

// API Routes
app.use("/api", routes);

// Handle unknown route request
app.use("*", (req, res, next) => {
  next(ApiError.notFound(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Unhandled Rejection! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
