import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/User.js";

export function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: "14d" });
}

export async function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "请先登录" });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "用户不存在" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "登录已过期，请重新登录" });
  }
}
