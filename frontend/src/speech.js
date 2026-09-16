const FEMALE_NAMES = [
  "samantha", "karen", "moira", "tessa", "fiona", "victoria", "allison", "ava",
  "susan", "zoe", "nicky", "serena", "kate", "zira", "aria", "jenny", "sonia",
  "hazel", "samantha compact", "google uk english female", "google us english",
];
const MALE_NAMES = [
  "male", "alex", "daniel", "david", "fred", "tom", "mark", "george", "james",
  "thomas", "fred", "rishi", "oliver", "google uk english male",
];

let cachedVoice = null;

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  const lang = (voice.lang || "").toLowerCase().replace("_", "-");
  if (!lang.startsWith("en")) return -100;
  if (MALE_NAMES.some((n) => name.includes(n)) && !name.includes("female")) return -20;
  let score = 1;
  if (FEMALE_NAMES.some((n) => name.includes(n))) score += 30;
  if (name.includes("female")) score += 25;
  if (name.includes("samantha")) score += 12;
  if (lang.startsWith("en-us") || lang.startsWith("en-gb")) score += 6;
  if (voice.localService) score += 2;
  return score;
}

function pickFemaleVoice(voices) {
  const ranked = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return ranked[0] && scoreVoice(ranked[0]) > 0 ? ranked[0] : null;
}

function loadVoices() {
  const current = window.speechSynthesis?.getVoices?.() || [];
  if (current.length) return Promise.resolve(current);
  return new Promise((resolve) => {
    const finish = () => resolve(window.speechSynthesis.getVoices() || []);
    window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, 400);
  });
}

export async function speak(text, lang = "en-US") {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const voices = await loadVoices();
  if (!cachedVoice || !voices.includes(cachedVoice)) {
    cachedVoice = pickFemaleVoice(voices);
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = cachedVoice?.lang || lang;
  utter.rate = 0.9;
  utter.pitch = 1.12;
  utter.volume = 1;
  if (cachedVoice) utter.voice = cachedVoice;
  window.setTimeout(() => window.speechSynthesis.speak(utter), 40);
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices().then((voices) => {
    cachedVoice = pickFemaleVoice(voices);
  });
}

export function canRecognize() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function recognizeEnglish() {
  return new Promise((resolve, reject) => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) {
      reject(new Error("当前浏览器不支持语音识别，请使用 Chrome，或改用键盘跟读。"));
      return;
    }
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => resolve(e.results[0][0].transcript);
    rec.onerror = (e) => reject(new Error(e.error === "not-allowed" ? "请允许麦克风权限" : "识别失败，请再试一次"));
    rec.start();
  });
}

export function scorePronunciation(expected, actual) {
  const a = normalize(expected);
  const b = normalize(actual);
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  const max = Math.max(a.length, b.length);
  return Math.max(0, Math.round((1 - dist / max) * 100));
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j += 1) m[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return m[a.length][b.length];
}
