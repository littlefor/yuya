import { Router } from "express";
import { Category } from "../models/Category.js";
import { WordRoot } from "../models/WordRoot.js";
import { Word } from "../models/Word.js";
import { Scenario } from "../models/Scenario.js";
import { GrammarLesson } from "../models/GrammarLesson.js";
import { authRequired } from "../middleware/auth.js";
import { shuffle } from "../services/learning.js";

export const contentRouter = Router();

contentRouter.get("/categories", async (_req, res) => {
  const items = await Category.find().sort({ examFocus: 1, name: 1 }).lean();
  const counts = await Word.aggregate([{ $group: { _id: "$categorySlug", count: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  res.json(items.map((c) => ({ ...c, wordCount: map[c.slug] || 0 })));
});

contentRouter.get("/roots", async (_req, res) => {
  const items = await WordRoot.find().lean();
  const counts = await Word.aggregate([
    { $unwind: "$rootSlugs" },
    { $group: { _id: "$rootSlugs", count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const familyOrder = ["prefix", "suffix", "root"];
  const familyName = { prefix: "前缀", suffix: "后缀", root: "词根" };
  const familyEmoji = { prefix: "⬅️", suffix: "➡️", root: "🌱" };
  const families = familyOrder.map((type) => {
    const list = items.filter((r) => r.type === type);
    const groups = [];
    for (const r of list) {
      let g = groups.find((x) => x.slug === r.group);
      if (!g) {
        g = { slug: r.group, name: r.groupName, roots: [] };
        groups.push(g);
      }
      g.roots.push({
        ...r,
        wordCount: (map[r.slug] || 0) + (r.examples?.length || 0),
      });
    }
    return { type, name: familyName[type], emoji: familyEmoji[type], groups };
  });
  res.json({
    total: items.length,
    families,
    roots: items.map((r) => ({ ...r, wordCount: (map[r.slug] || 0) + (r.examples?.length || 0) })),
  });
});

contentRouter.get("/roots/:slug", async (req, res) => {
  const root = await WordRoot.findOne({ slug: req.params.slug }).lean();
  if (!root) return res.status(404).json({ message: "词根不存在" });
  const lexicon = await Word.find({ rootSlugs: root.slug }).lean();
  const seen = new Set();
  const examples = [];
  for (const w of [...(root.examples || []), ...lexicon.map((w) => ({
    lemma: w.lemma, ipa: w.ipa, meaning: w.meaning, emoji: w.emoji, breakdown: "", _id: w._id,
  }))]) {
    const key = String(w.lemma).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    examples.push(w);
  }
  res.json({ ...root, examples, wordCount: examples.length });
});

contentRouter.get("/words", async (req, res) => {
  const { category, root, stage, q, cluster, examLevel } = req.query;
  const filter = {};
  if (category) filter.categorySlug = category;
  if (root) filter.rootSlugs = root;
  if (stage) filter.stage = stage;
  if (cluster) filter.cluster = cluster;
  if (q) {
    filter.$or = [
      { lemma: new RegExp(String(q), "i") },
      { meaning: new RegExp(String(q), "i") },
    ];
  }
  if (examLevel === "CET4") filter.examLevel = "CET4";
  else if (examLevel === "CET6") filter.examLevel = { $in: ["CET4", "CET6"] };
  const items = await Word.find(filter).lean();
  if (category) {
    const cat = await Category.findOne({ slug: category }).lean();
    const order = (cat?.clusters || []).map((c) => c.slug);
    items.sort((a, b) => {
      const ai = order.indexOf(a.cluster);
      const bi = order.indexOf(b.cluster);
      const ao = ai < 0 ? 99 : ai;
      const bo = bi < 0 ? 99 : bi;
      if (ao !== bo) return ao - bo;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
  } else {
    items.sort((a, b) => String(a.lemma).localeCompare(String(b.lemma)));
  }
  res.json(items);
});

contentRouter.get("/words/:id", async (req, res) => {
  const word = await Word.findById(req.params.id).lean();
  if (!word) return res.status(404).json({ message: "单词不存在" });
  const related = await Word.find({
    _id: { $ne: word._id },
    $or: [{ categorySlug: word.categorySlug }, { rootSlugs: { $in: word.rootSlugs } }],
  })
    .limit(6)
    .lean();
  res.json({ word, related });
});

contentRouter.get("/scenarios", async (_req, res) => {
  const items = await Scenario.find().sort({ sortOrder: 1, stage: 1 }).lean();
  res.json(items.map((s) => ({
    id: s._id,
    slug: s.slug,
    title: s.title,
    titleEn: s.titleEn,
    emoji: s.emoji,
    place: s.place,
    description: s.description,
    stage: s.stage,
    phraseCount: s.usefulPhrases.length,
    lineCount: s.dialogue.length,
    quizCount: s.quizzes.length,
  })));
});

contentRouter.get("/scenarios/:slug", async (req, res) => {
  const item = await Scenario.findOne({ slug: req.params.slug }).lean();
  if (!item) return res.status(404).json({ message: "场景不存在" });
  res.json(item);
});

contentRouter.get("/grammar", async (_req, res) => {
  const items = await GrammarLesson.find().sort({ sortOrder: 1, stage: 1 }).lean();
  res.json(items.map((g) => ({
    id: g._id,
    slug: g.slug,
    title: g.title,
    titleEn: g.titleEn,
    emoji: g.emoji,
    summary: g.summary,
    stage: g.stage,
    quizCount: g.quizzes.length,
  })));
});

contentRouter.get("/grammar/:slug", async (req, res) => {
  const item = await GrammarLesson.findOne({ slug: req.params.slug }).lean();
  if (!item) return res.status(404).json({ message: "课程不存在" });
  res.json(item);
});

contentRouter.get("/practice/quiz", authRequired, async (req, res) => {
  const { category, root } = req.query;
  const filter = {};
  if (category) filter.categorySlug = category;
  if (root) filter.rootSlugs = root;
  const pool = await Word.find(filter).lean();
  if (pool.length < 4) return res.status(400).json({ message: "题目不足" });
  const target = pool[Math.floor(Math.random() * pool.length)];
  const others = shuffle(pool.filter((w) => w._id.toString() !== target._id.toString())).slice(0, 3);
  const options = shuffle([target, ...others]).map((w) => ({ id: w._id, meaning: w.meaning, lemma: w.lemma }));
  res.json({
    word: target,
    question: `“${target.lemma}” 的中文是？`,
    options,
    answerId: target._id,
  });
});
