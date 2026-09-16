import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: [Number],
}, { timestamps: true });

export const TestAttempt = mongoose.model("TestAttempt", attemptSchema);
