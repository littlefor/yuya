import mongoose from "mongoose";

const grammarSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  titleEn: { type: String, required: true },
  emoji: { type: String, required: true },
  summary: { type: String, required: true },
  points: [String],
  examples: [{ en: String, zh: String, highlight: String }],
  quizzes: [
    {
      question: String,
      options: [String],
      answer: Number,
      explain: String,
    },
  ],
  stage: { type: String, default: "A1" },
  sortOrder: { type: Number, default: 0 },
});

export const GrammarLesson = mongoose.model("GrammarLesson", grammarSchema);
