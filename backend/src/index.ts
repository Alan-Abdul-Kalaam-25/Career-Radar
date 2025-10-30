import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";

const app = express();

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// Allow configuring multiple frontend origins as a comma-separated list in FRONTEND_ORIGIN
const allowedOrigins = FRONTEND_ORIGIN.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (
    incomingOrigin: string | undefined,
    callback: (err: Error | null, allowed?: boolean | string) => void
  ) => {
    // Allow requests with no origin (e.g., server-to-server, mobile, curl)
    if (!incomingOrigin) return callback(null, true);
    if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
    // If running in development and localhost present in list, allow localhost variants
    if (
      process.env.NODE_ENV !== "production" &&
      incomingOrigin.startsWith("http://localhost")
    )
      return callback(null, true);
    return callback(new Error("CORS origin denied"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.get("/", (_req, res) => {
  res.json({
    name: "Career Radar API",
    env: process.env.NODE_ENV || "development",
    port: PORT,
    corsOrigin: FRONTEND_ORIGIN,
    health: "/api/health",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/career", careerRoutes);

connectDB()
  .then((m) => {
    const host = m.connection.host;
    const db = m.connection.name;
    console.log(`MongoDB connected → ${host}/${db}`);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB", err);
    process.exit(1);
  });
