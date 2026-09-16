import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    speaker: String,
    en: String,
    zh: String,
    ipa: String,
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  titleEn: { type: String, required: true },
  emoji: { type: String, required: true },
  place: { type: String, required: true },
  description: { type: String, required: true },
  usefulPhrases: [{ en: String, zh: String, ipa: String }],
  dialogue: [lineSchema],
  quizzes: [
    {
      question: String,
      options: [String],
      answer: Number,
      explain: String,
    },
  ],
  stage: { type: String, default: "A2" },
  sortOrder: { type: Number, default: 0 },
});

export const Scenario = mongoose.model("Scenario", scenarioSchema);
