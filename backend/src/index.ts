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

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
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
