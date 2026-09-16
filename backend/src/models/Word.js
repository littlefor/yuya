import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  lemma: { type: String, required: true, unique: true },
  ipa: { type: String, required: true },
  pos: { type: String, required: true },
  meaning: { type: String, required: true },
  example: { type: String, required: true },
  exampleZh: { type: String, required: true },
  emoji: { type: String, required: true },
  imageHint: { type: String, required: true },
  categorySlug: { type: String, required: true, index: true },
  cluster: { type: String, default: "general", index: true },
  clusterName: { type: String, default: "通用" },
  examLevel: { type: String, enum: ["CET4", "CET6", "IELTS"], default: "CET4", index: true },
  sortOrder: { type: Number, default: 0 },
  rootSlugs: { type: [String], default: [] },
  stage: { type: String, default: "A1" },
});

export const Word = mongoose.model("Word", wordSchema);
