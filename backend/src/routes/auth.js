import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { authRequired, signToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "请填写昵称、邮箱和密码" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "密码至少 6 位" });
  }
  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) return res.status(409).json({ message: "该邮箱已注册" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  if (!user) return res.status(401).json({ message: "邮箱或密码不正确" });
  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "邮箱或密码不正确" });
  res.json({ token: signToken(user), user: publicUser(user) });
});

authRouter.get("/me", authRequired, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

authRouter.patch("/me", authRequired, async (req, res) => {
  const { name, dailyMinutes } = req.body || {};
  if (name) req.user.name = name;
  if ([10, 15, 30].includes(Number(dailyMinutes))) req.user.dailyMinutes = Number(dailyMinutes);
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    level: user.level,
    streak: user.streak,
    longestStreak: user.longestStreak,
    lastCheckIn: user.lastCheckIn,
    xp: user.xp,
    dailyMinutes: user.dailyMinutes,
    completedStages: user.completedStages,
    unlockedTests: user.unlockedTests,
  };
}
