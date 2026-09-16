import { Router } from "express";
import { LevelTest } from "../models/LevelTest.js";
import { TestAttempt } from "../models/TestAttempt.js";
import { authRequired } from "../middleware/auth.js";
import { NEXT_LEVEL, publicUserSafe } from "./helpers.js";

export const testRouter = Router();

testRouter.get("/", authRequired, async (req, res) => {
  const tests = await LevelTest.find().sort({ level: 1 }).lean();
  const attempts = await TestAttempt.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({
    unlocked: req.user.unlockedTests,
    completedStages: req.user.completedStages,
    tests: tests.map((t) => ({
      level: t.level,
      title: t.title,
      description: t.description,
      passScore: t.passScore,
      questionCount: t.questions.length,
      unlocked: req.user.unlockedTests.includes(t.level),
      bestScore: Math.max(0, ...attempts.filter((a) => a.level === t.level).map((a) => a.score)),
    })),
  });
});

testRouter.get("/:level", authRequired, async (req, res) => {
  if (!req.user.unlockedTests.includes(req.params.level)) {
    return res.status(403).json({ message: "请先完成前一阶段" });
  }
  const test = await LevelTest.findOne({ level: req.params.level }).lean();
  if (!test) return res.status(404).json({ message: "测试不存在" });
  const questions = test.questions.map((q, i) => ({
    index: i,
    type: q.type,
    prompt: q.prompt,
    audioText: q.audioText || "",
    options: q.options,
  }));
  res.json({ level: test.level, title: test.title, description: test.description, passScore: test.passScore, questions });
});

testRouter.post("/:level/submit", authRequired, async (req, res) => {
  if (!req.user.unlockedTests.includes(req.params.level)) {
    return res.status(403).json({ message: "请先完成前一阶段" });
  }
  const test = await LevelTest.findOne({ level: req.params.level });
  if (!test) return res.status(404).json({ message: "测试不存在" });
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  let correct = 0;
  const review = test.questions.map((q, i) => {
    const ok = Number(answers[i]) === q.answer;
    if (ok) correct += 1;
    return {
      index: i,
      correct: ok,
      answer: q.answer,
      yours: answers[i],
      explain: q.explain,
      prompt: q.prompt,
      options: q.options,
    };
  });
  const score = Math.round((correct / test.questions.length) * 100);
  const passed = score >= test.passScore;
  await TestAttempt.create({ userId: req.user._id, level: test.level, score, passed, answers });

  if (passed) {
    if (!req.user.completedStages.includes(test.level)) req.user.completedStages.push(test.level);
    req.user.level = test.level;
    const next = NEXT_LEVEL[test.level];
    if (next && !req.user.unlockedTests.includes(next)) req.user.unlockedTests.push(next);
    req.user.xp += passed ? 40 : 10;
    await req.user.save();
  } else {
    req.user.xp += 8;
    await req.user.save();
  }

  res.json({ score, passed, passScore: test.passScore, review, user: publicUserSafe(req.user) });
});
