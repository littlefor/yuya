import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    level: { type: String, default: "A1", enum: ["A1", "A2", "B1", "B2", "C1"] },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCheckIn: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    dailyMinutes: { type: Number, default: 15, enum: [10, 15, 30] },
    completedStages: { type: [String], default: [] },
    unlockedTests: { type: [String], default: ["A1"] },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
