import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/be-social",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  rootDir: process.cwd(),
  uploadPath: path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads")
};
