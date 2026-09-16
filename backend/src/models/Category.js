import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  emoji: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  stage: { type: String, default: "A1" },
  examFocus: { type: String, default: "CET4" },
  clusters: [{ slug: String, name: String, nameEn: String, emoji: String }],
});

export const Category = mongoose.model("Category", categorySchema);
