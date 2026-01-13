import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import debug from "debug";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import jobRoutes from "./routes/job";
import companyRoutes from "./routes/company";
import applicationRoutes from "./routes/application";
import seoRoutes from "./routes/seo";
import openapiRoutes from "./routes/openapi";
import notificationRoutes from "./routes/notification";
import aiRoutes from "./routes/ai";
import adminRoutes from "./routes/admin";
import sourceAdminRoutes from "./routes/source";
import userRoutes from './routes/user';
import skillsRoutes from './routes/skills';
import profileFieldsRoutes from './routes/profileFields';

dotenv.config();
const log = debug("jobintel:server");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "jobscout-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/docs", openapiRoutes);
app.use(seoRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/admin', sourceAdminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile-fields', profileFieldsRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

(async () => {
  try {
    await connectDB(MONGODB_URI);
    log("DB connected");
  } catch (err) {
    console.warn("Failed to connect to DB (continuing in degraded mode):", err?.message || err);
  }

  app.listen(PORT, () => {
    log(`Backend listening on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
})();
