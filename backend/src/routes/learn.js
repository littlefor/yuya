import { Router } from "express";
import { Word } from "../models/Word.js";
import { WordProgress } from "../models/WordProgress.js";
import { DailySession } from "../models/DailySession.js";
import { CheckIn } from "../models/CheckIn.js";
import { Scenario } from "../models/Scenario.js";
import { GrammarLesson } from "../models/GrammarLesson.js";
import { authRequired } from "../middleware/auth.js";
import { applySm2, qualityFromResult, todayKey, yesterdayKey, pick, xpForMinutes } from "../services/learning.js";

export const learnRouter = Router();

learnRouter.get("/review-queue", authRequired, async (req, res) => {
  const due = await WordProgress.find({
    userId: req.user._id,
    nextReviewAt: { $lte: new Date() },
  })
    .populate("wordId")
    .sort({ nextReviewAt: 1 })
    .limit(40)
    .lean();

  const yesterday = yesterdayKey();
  const ySession = await DailySession.findOne({ userId: req.user._id, date: yesterday }).lean();
  const yWordIds = (ySession?.tasks || [])
    .filter((t) => t.payload?.wordId && t.correct === false)
    .map((t) => String(t.payload.wordId));

  const extra = yWordIds.length
    ? await Word.find({ _id: { $in: yWordIds } }).lean()
    : [];

  const words = [
    ...due.map((p) => ({ ...p.wordId, progress: p, reason: "srs" })),
    ...extra.map((w) => ({ ...w, reason: "yesterday" })),
  ];

  res.json({
    dueCount: due.length,
    yesterdayMissed: extra.length,
    words,
  });
});

learnRouter.post("/review", authRequired, async (req, res) => {
  const { wordId, result, quality } = req.body || {};
  if (!wordId) return res.status(400).json({ message: "缺少 wordId" });
  const word = await Word.findById(wordId);
  if (!word) return res.status(404).json({ message: "单词不存在" });

  let progress = await WordProgress.findOne({ userId: req.user._id, wordId });
  if (!progress) {
    progress = await WordProgress.create({ userId: req.user._id, wordId });
  }
  applySm2(progress, quality ?? qualityFromResult(result));
  await progress.save();
  req.user.xp += qualityFromResult(result) >= 3 ? 2 : 1;
  await req.user.save();
  res.json({ progress, xp: req.user.xp });
});

learnRouter.post("/daily/start", authRequired, async (req, res) => {
  const minutes = Number(req.body?.minutes || req.user.dailyMinutes);
  if (![10, 15, 30].includes(minutes)) {
    return res.status(400).json({ message: "时长只能是 10 / 15 / 30 分钟" });
  }
  const date = todayKey();
  let session = await DailySession.findOne({ userId: req.user._id, date }).sort({ createdAt: -1 });
  if (session) return res.json(await hydrateSession(session));

  req.user.dailyMinutes = minutes;
  await req.user.save();

  const tasks = await buildDailyTasks(req.user._id, minutes);
  session = await DailySession.create({ userId: req.user._id, date, minutes, tasks });
  res.json(await hydrateSession(session));
});

learnRouter.get("/daily/today", authRequired, async (req, res) => {
  const session = await DailySession.findOne({ userId: req.user._id, date: todayKey() }).sort({ createdAt: -1 });
  if (!session) return res.json(null);
  res.json(await hydrateSession(session));
});

learnRouter.post("/daily/:id/task/:taskId", authRequired, async (req, res) => {
  const session = await DailySession.findOne({ _id: req.params.id, userId: req.user._id });
  if (!session) return res.status(404).json({ message: "训练不存在" });
  const task = session.tasks.id(req.params.taskId);
  if (!task) return res.status(404).json({ message: "题目不存在" });
  task.done = true;
  task.correct = Boolean(req.body?.correct);
  if (task.payload?.wordId) {
    let progress = await WordProgress.findOne({ userId: req.user._id, wordId: task.payload.wordId });
    if (!progress) progress = await WordProgress.create({ userId: req.user._id, wordId: task.payload.wordId });
    applySm2(progress, task.correct ? 5 : 1);
    await progress.save();
  }
  await session.save();
  res.json(await hydrateSession(session));
});

learnRouter.post("/daily/:id/complete", authRequired, async (req, res) => {
  const session = await DailySession.findOne({ _id: req.params.id, userId: req.user._id });
  if (!session) return res.status(404).json({ message: "训练不存在" });
  if (session.status === "completed") return res.json({ session, user: req.user });

  const doneCount = session.tasks.filter((t) => t.done).length;
  const xp = xpForMinutes(session.minutes) + doneCount;
  session.status = "completed";
  session.completedAt = new Date();
  session.xpEarned = xp;
  await session.save();

  const date = session.date;
  const prev = req.user.lastCheckIn;
  const yesterday = yesterdayKey();
  if (prev === date) {
    // already counted
  } else if (prev === yesterday) {
    req.user.streak += 1;
  } else {
    req.user.streak = 1;
  }
  req.user.longestStreak = Math.max(req.user.longestStreak, req.user.streak);
  req.user.lastCheckIn = date;
  req.user.xp += xp;
  await req.user.save();

  await CheckIn.findOneAndUpdate(
    { userId: req.user._id, date },
    { minutes: session.minutes, xp, wordsReviewed: session.tasks.filter((t) => t.type === "word").length },
    { upsert: true }
  );

  res.json({ session, xpEarned: xp, streak: req.user.streak, xp: req.user.xp });
});

learnRouter.get("/checkins", authRequired, async (req, res) => {
  const items = await CheckIn.find({ userId: req.user._id }).sort({ date: -1 }).limit(30).lean();
  res.json(items);
});

async function buildDailyTasks(userId, minutes) {
  const wordTarget = minutes === 10 ? 6 : minutes === 15 ? 8 : 12;
  const due = await WordProgress.find({ userId, nextReviewAt: { $lte: new Date() } }).limit(wordTarget).lean();
  const dueIds = due.map((d) => d.wordId);
  const reviewWords = dueIds.length ? await Word.find({ _id: { $in: dueIds } }).lean() : [];
  const newWords = await Word.aggregate([
    { $match: dueIds.length ? { _id: { $nin: dueIds } } : {} },
    { $sample: { size: Math.max(2, wordTarget - reviewWords.length) } },
  ]);
  const words = [...reviewWords, ...newWords].slice(0, wordTarget);
  const allWords = await Word.find().lean();

  const tasks = words.map((w) => {
    const options = pick(
      allWords.filter((x) => x.lemma !== w.lemma).map((x) => x.meaning),
      3
    );
    const choices = pick([w.meaning, ...options], 4);
    return {
      type: "word",
      payload: {
        wordId: w._id,
        lemma: w.lemma,
        ipa: w.ipa,
        meaning: w.meaning,
        emoji: w.emoji,
        example: w.example,
        exampleZh: w.exampleZh,
        imageHint: w.imageHint,
        options: choices,
        answer: w.meaning,
        reason: dueIds.some((id) => String(id) === String(w._id)) ? "review" : "new",
      },
    };
  });

  const speakWord = words[0];
  if (speakWord) {
    tasks.push({
      type: "pronounce",
      payload: {
        wordId: speakWord._id,
        lemma: speakWord.lemma,
        ipa: speakWord.ipa,
        meaning: speakWord.meaning,
        emoji: speakWord.emoji,
      },
    });
  }

  const grammar = await GrammarLesson.aggregate([{ $sample: { size: 1 } }]);
  if (grammar[0]?.quizzes?.[0]) {
    const q = grammar[0].quizzes[0];
    tasks.push({
      type: "grammar",
      payload: {
        slug: grammar[0].slug,
        title: grammar[0].title,
        question: q.question,
        options: q.options,
        answer: q.options[q.answer],
        explain: q.explain,
      },
    });
  }

  if (minutes >= 15) {
    const scenario = await Scenario.aggregate([{ $sample: { size: 1 } }]);
    if (scenario[0]?.quizzes?.[0]) {
      const q = scenario[0].quizzes[0];
      tasks.push({
        type: "scenario",
        payload: {
          slug: scenario[0].slug,
          title: scenario[0].title,
          emoji: scenario[0].emoji,
          question: q.question,
          options: q.options,
          answer: q.options[q.answer],
          explain: q.explain,
        },
      });
    }
  }

  if (minutes >= 30 && grammar[0]?.quizzes?.[1]) {
    const q = grammar[0].quizzes[1];
    tasks.push({
      type: "grammar",
      payload: {
        slug: grammar[0].slug,
        title: grammar[0].title,
        question: q.question,
        options: q.options,
        answer: q.options[q.answer],
        explain: q.explain,
      },
    });
  }

  return tasks;
}

async function hydrateSession(session) {
  const obj = session.toObject ? session.toObject() : session;
  const done = obj.tasks.filter((t) => t.done).length;
  return {
    ...obj,
    id: obj._id,
    progress: obj.tasks.length ? Math.round((done / obj.tasks.length) * 100) : 0,
    remaining: obj.tasks.length - done,
  };
}
