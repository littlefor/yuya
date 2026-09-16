import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config.js";
import { seedDatabase } from "./seed/index.js";
import { authRouter } from "./routes/auth.js";
import { contentRouter } from "./routes/content.js";
import { learnRouter } from "./routes/learn.js";
import { testRouter } from "./routes/tests.js";
import { authRequired } from "./middleware/auth.js";
import { WordProgress } from "./models/WordProgress.js";
import { CheckIn } from "./models/CheckIn.js";
import { publicUserSafe } from "./routes/helpers.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "LinguaSeed", time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api", contentRouter);
app.use("/api/learn", learnRouter);
app.use("/api/tests", testRouter);

app.get("/api/progress", authRequired, async (req, res) => {
  const learned = await WordProgress.countDocuments({ userId: req.user._id });
  const mastered = await WordProgress.countDocuments({ userId: req.user._id, repetitions: { $gte: 2 } });
  const due = await WordProgress.countDocuments({ userId: req.user._id, nextReviewAt: { $lte: new Date() } });
  const checkins = await CheckIn.find({ userId: req.user._id }).sort({ date: -1 }).limit(14).lean();
  res.json({ learned, mastered, due, checkins, user: publicUserSafe(req.user) });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "服务器开小差了，请稍后再试" });
});

async function start() {
  await mongoose.connect(config.mongoUri);
  if (config.seedOnStart) {
    const result = await seedDatabase();
    console.log("seed:", result);
  }
  app.listen(config.port, () => {
    console.log(`LinguaSeed API on :${config.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
