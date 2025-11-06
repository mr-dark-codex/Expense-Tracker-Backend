import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret-key",
    expiresIn: process.env.JWT_EXPIRATION || "7d",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15", 10) * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};
