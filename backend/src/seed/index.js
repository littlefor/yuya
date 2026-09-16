import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { config } from "../config.js";
import { Category } from "../models/Category.js";
import { WordRoot } from "../models/WordRoot.js";
import { Word } from "../models/Word.js";
import { Scenario } from "../models/Scenario.js";
import { GrammarLesson } from "../models/GrammarLesson.js";
import { LevelTest } from "../models/LevelTest.js";
import { User } from "../models/User.js";
import { categories, roots, words, scenarios, grammarLessons, levelTests } from "./content.js";
import { WordProgress } from "../models/WordProgress.js";

function withOrder(list) {
  return list.map((item, i) => ({ ...item, sortOrder: i }));
}

export async function seedDatabase() {
  const count = await Word.countDocuments();
  const rootCount = await WordRoot.countDocuments();
  const grammarCount = await GrammarLesson.countDocuments();
  const scenarioCount = await Scenario.countDocuments();
  const empty = count === 0;
  const forceFull = process.env.FORCE_SEED === "true" || (count > 0 && (count !== words.length || rootCount !== roots.length));

  if (empty || forceFull) {
    await Promise.all([
      Category.deleteMany({}),
      WordRoot.deleteMany({}),
      Word.deleteMany({}),
      WordProgress.deleteMany({}),
      Scenario.deleteMany({}),
      GrammarLesson.deleteMany({}),
      LevelTest.deleteMany({}),
    ]);
    await Category.insertMany(categories);
    await WordRoot.insertMany(roots);
    await Word.insertMany(words);
    await Scenario.insertMany(withOrder(scenarios));
    await GrammarLesson.insertMany(withOrder(grammarLessons));
    await LevelTest.insertMany(levelTests);
    await ensureDemoUser();
    return { seeded: true, words: words.length };
  }

  const patches = {};
  if (grammarCount !== grammarLessons.length) {
    await GrammarLesson.deleteMany({});
    await GrammarLesson.insertMany(withOrder(grammarLessons));
    patches.grammar = grammarLessons.length;
  }
  if (scenarioCount !== scenarios.length) {
    await Scenario.deleteMany({});
    await Scenario.insertMany(withOrder(scenarios));
    patches.scenarios = scenarios.length;
  }
  await ensureDemoUser();
  return { seeded: Object.keys(patches).length > 0, words: count, patches };
}

async function ensureDemoUser() {
  const email = "demo@linguaseed.app";
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash("demo123", 10);
  return User.create({
    name: "体验同学",
    email,
    passwordHash,
    level: "A1",
    dailyMinutes: 15,
  });
}

if (process.argv[1]?.includes("seed")) {
  mongoose.connect(config.mongoUri).then(async () => {
    const result = await seedDatabase();
    console.log(result);
    await mongoose.disconnect();
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
