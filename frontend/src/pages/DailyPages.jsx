import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { ProgressBar, SpeakButton, WordVisual } from "../components.jsx";
import { recognizeEnglish, scorePronunciation } from "../speech.js";

export function ReviewPage() {
  const [queue, setQueue] = useState(null);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => { api("/learn/review-queue").then(setQueue); }, []);
  const word = queue?.words?.[i];

  async function rate(result) {
    await api("/learn/review", { method: "POST", body: JSON.stringify({ wordId: word._id, result }) });
    setShow(false);
    setI((n) => n + 1);
  }

  if (!queue) return <p>加载中…</p>;
  if (!word) {
    return (
      <div className="card">
        <h1>今天没有待复习的词了</h1>
        <p className="muted">到期 {queue.dueCount} · 昨天错过 {queue.yesterdayMissed}</p>
        <Link className="btn moss" to="/daily">去做每日训练</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <p className="muted">{word.reason === "yesterday" ? "来自昨天的错题" : "间隔重复到期"} · {i + 1}/{queue.words.length}</p>
      <WordVisual emoji={word.emoji} ipa={show ? word.ipa : ""} lemma={show ? word.lemma : ""} />
      {show ? (
        <>
          <h1 className="lemma serif">{word.lemma}</h1>
          <p>{word.meaning}</p>
          <p className="muted">{word.example}</p>
          <SpeakButton text={word.lemma} />
          <div className="btn-group">
            <button className="btn warn" onClick={() => rate("unknown")}>不认识</button>
            <button className="btn ghost" onClick={() => rate("fuzzy")}>模糊</button>
            <button className="btn moss" onClick={() => rate("known")}>认识</button>
          </div>
        </>
      ) : (
        <button className="btn moss" style={{ marginTop: 16 }} onClick={() => setShow(true)}>显示词义</button>
      )}
    </div>
  );
}

export function DailyPage() {
  const { user, setUser, refresh } = useAuth();
  const [minutes, setMinutes] = useState(user?.dailyMinutes || 15);
  const [session, setSession] = useState(null);
  const [left, setLeft] = useState(0);
  const [picked, setPicked] = useState(null);
  const [heard, setHeard] = useState("");
  const [msg, setMsg] = useState("");

  const current = useMemo(() => session?.tasks?.find((t) => !t.done), [session]);
  const total = session?.tasks?.length || 0;
  const done = session?.tasks?.filter((t) => t.done).length || 0;

  useEffect(() => {
    api("/learn/daily/today").then((s) => {
      if (s) {
        setSession(s);
        setMinutes(s.minutes);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!session || session.status === "completed") return undefined;
    setLeft(session.minutes * 60);
    const t = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [session?._id]);

  async function start() {
    const s = await api("/learn/daily/start", { method: "POST", body: JSON.stringify({ minutes }) });
    setSession(s);
    setPicked(null);
    setMsg("");
  }

  async function submit(correct) {
    const updated = await api(`/learn/daily/${session._id}/task/${current._id}`, {
      method: "POST",
      body: JSON.stringify({ correct }),
    });
    setSession(updated);
    setPicked(null);
    setHeard("");
    if (updated.remaining === 0) await finish(updated);
  }

  async function finish(s = session) {
    const result = await api(`/learn/daily/${s._id}/complete`, { method: "POST" });
    setSession(result.session);
    setUser((u) => ({ ...u, streak: result.streak, xp: result.xp }));
    await refresh();
    setMsg(`打卡成功，+${result.xpEarned} XP，连续 ${result.streak} 天`);
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  if (session?.status === "completed") {
    return (
      <div className="card">
        <h1>今日已打卡</h1>
        <p>获得 {session.xpEarned} XP。明天同一时间会看到昨天的错词。</p>
        {msg ? <p>{msg}</p> : null}
        <Link className="btn moss" to="/review">再看一遍复习队列</Link>
      </div>
    );
  }

  return (
    <div>
      <p className="kicker">Daily quest</p>
      <h1>每日打卡训练</h1>
      {!session ? (
        <div className="card">
          <p>选择今天的学习时长。内容会混合：新词、复习词、发音、语法，15 分钟以上还会加入场景题。</p>
          <div className="btn-group">
            {[10, 15, 30].map((m) => (
              <button key={m} className={minutes === m ? "btn moss" : "btn ghost"} onClick={() => setMinutes(m)}>{m} 分钟</button>
            ))}
          </div>
          <button className="btn" style={{ marginTop: 16 }} onClick={start}>生成今日任务</button>
        </div>
      ) : (
        <div className="grid grid-2">
          <div className="card">
            <div className="timer">{mm}:{ss}</div>
            <p className="muted">已完成 {done}/{total}</p>
            <ProgressBar value={session.progress} />
            <button className="btn ghost" style={{ marginTop: 16 }} onClick={() => finish()}>提前打卡</button>
          </div>
          <div className="card">
            {current?.type === "word" ? (
              <>
                <p className="muted">{current.payload.reason === "review" ? "复习" : "新词"}</p>
                <WordVisual emoji={current.payload.emoji} ipa={current.payload.ipa} lemma={current.payload.lemma} />
                <h2 className="serif">{current.payload.lemma}</h2>
                <SpeakButton text={current.payload.lemma} />
                {current.payload.options.map((opt) => (
                  <button
                    key={opt}
                    className={`option ${picked ? (opt === current.payload.answer ? "correct" : picked === opt ? "wrong" : "") : ""}`}
                    onClick={() => { setPicked(opt); submit(opt === current.payload.answer); }}
                  >
                    {opt}
                  </button>
                ))}
              </>
            ) : null}
            {current?.type === "grammar" || current?.type === "scenario" ? (
              <>
                <p className="kicker">{current.payload.title}</p>
                <h3>{current.payload.question}</h3>
                {current.payload.options.map((opt) => (
                  <button key={opt} className="option" onClick={() => submit(opt === current.payload.answer)}>{opt}</button>
                ))}
              </>
            ) : null}
            {current?.type === "pronounce" ? (
              <>
                <h2 className="serif">{current.payload.lemma}</h2>
                <p>{current.payload.ipa} · {current.payload.meaning}</p>
                <SpeakButton text={current.payload.lemma} />
                <button className="btn moss" onClick={async () => {
                  try {
                    const text = await recognizeEnglish();
                    setHeard(text);
                    const score = scorePronunciation(current.payload.lemma, text);
                    await submit(score >= 70);
                  } catch {
                    await submit(true);
                  }
                }}>跟读并提交</button>
                <button className="btn ghost" onClick={() => submit(true)}>先听过，标记完成</button>
                {heard ? <p>识别：{heard}</p> : null}
              </>
            ) : null}
            {!current ? <p>题目已完成，正在结算打卡…</p> : null}
          </div>
        </div>
      )}
    </div>
  );
}
