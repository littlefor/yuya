export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function applySm2(progress, quality) {
  const q = Math.max(0, Math.min(5, Number(quality)));
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = progress;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.max(1, Math.round(interval * easeFactor));
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const nextReviewAt = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

  progress.easeFactor = Number(easeFactor.toFixed(2));
  progress.interval = interval;
  progress.repetitions = repetitions;
  progress.nextReviewAt = nextReviewAt;
  progress.lastQuality = q;
  progress.lastReviewedAt = new Date();
  progress.seenCount = (progress.seenCount || 0) + 1;
  if (q >= 3) progress.correctCount = (progress.correctCount || 0) + 1;
  return progress;
}

export function qualityFromResult(result) {
  if (result === "unknown") return 1;
  if (result === "fuzzy") return 3;
  if (result === "known") return 5;
  if (typeof result === "boolean") return result ? 5 : 1;
  return 3;
}

export function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pick(list, n) {
  return shuffle(list).slice(0, n);
}

export function xpForMinutes(minutes) {
  if (minutes >= 30) return 45;
  if (minutes >= 15) return 25;
  return 15;
}

export const NEXT_LEVEL = { A1: "A2", A2: "B1", B1: "B2", B2: "C1" };
