import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  level: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  passScore: { type: Number, default: 70 },
  questions: [
    {
      type: { type: String, enum: ["vocab", "grammar", "scenario", "listening"], required: true },
      prompt: String,
      audioText: String,
      options: [String],
      answer: Number,
      explain: String,
    },
  ],
});

export const LevelTest = mongoose.model("LevelTest", testSchema);
