import mongoose from "mongoose";

const wordRootSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  affix: { type: String, required: true },
  type: { type: String, enum: ["prefix", "suffix", "root"], required: true },
  family: { type: String, required: true },
  familyName: { type: String, required: true },
  group: { type: String, required: true },
  groupName: { type: String, required: true },
  meaning: { type: String, required: true },
  meaningEn: { type: String, required: true },
  tip: { type: String, required: true },
  color: { type: String, required: true },
  emoji: { type: String, default: "🧩" },
  stage: { type: String, default: "A2" },
  examples: [{
    lemma: String,
    ipa: String,
    meaning: String,
    emoji: String,
    breakdown: String,
  }],
});

export const WordRoot = mongoose.model("WordRoot", wordRootSchema);
