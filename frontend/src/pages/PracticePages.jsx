import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { SpeakButton } from "../components.jsx";
import { canRecognize, recognizeEnglish, scorePronunciation, speak } from "../speech.js";

const SCENARIO_STAGES = ["全部", "A1", "A2", "B1"];

export function ScenariosPage() {
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState("全部");
  useEffect(() => { api("/scenarios").then(setItems); }, []);
  const shown = stage === "全部" ? items : items.filter((s) => s.stage === stage);
  const quizTotal = items.reduce((n, s) => n + (s.quizCount || 0), 0);
  return (
    <div>
      <p className="kicker">Situational English</p>
      <h1>专项场景：把单词立刻用在对话里</h1>
      <p className="muted">现有 {items.length} 个场景、{quizTotal} 道练习，从点咖啡、坐地铁练到看病开会。</p>
      <div className="btn-group" style={{ margin: "14px 0 18px" }}>
        {SCENARIO_STAGES.map((s) => (
          <button key={s} className={stage === s ? "btn moss" : "btn ghost"} onClick={() => setStage(s)}>{s}</button>
        ))}
      </div>
      <div className="grid grid-2">
        {shown.map((s) => (
          <Link key={s.slug} to={`/scenarios/${s.slug}`} className="card">
            <div style={{ fontSize: 36 }}>{s.emoji}</div>
            <h3>{s.title} · {s.titleEn}</h3>
            <p className="muted">{s.description}</p>
            <p>{s.stage} · {s.lineCount} 句对话 · {s.quizCount} 题</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ScenarioDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [answers, setAnswers] = useState({});
  useEffect(() => {
    setItem(null);
    setAnswers({});
    api(`/scenarios/${slug}`).then(setItem);
  }, [slug]);
  if (!item) return <p>加载中…</p>;
  const answered = Object.keys(answers).length;
  const correct = item.quizzes.filter((q, qi) => answers[qi] === q.answer).length;
  return (
    <div className="grid grid-2">
      <div className="card">
        <p className="kicker">{item.stage} · {item.place}</p>
        <h1>{item.emoji} {item.title}</h1>
        <p className="muted">{item.description}</p>
        <h3>万能句</h3>
        {item.usefulPhrases.map((p) => (
          <div key={p.en} className="card" style={{ boxShadow: "none", marginBottom: 8 }}>
            <strong className="serif">{p.en}</strong>
            <div className="muted">{p.ipa}</div>
            <div>{p.zh}</div>
            <SpeakButton text={p.en} />
          </div>
        ))}
      </div>
      <div>
        <div className="card dialogue">
          <h3>情景对话 · {item.dialogue.length} 句</h3>
          {item.dialogue.map((line, idx) => (
            <div key={idx} className={`bubble ${line.speaker === "You" ? "you" : ""}`}>
              <div style={{ opacity: .7, fontSize: 12 }}>{line.speaker}</div>
              <div className="serif">{line.en}</div>
              <div>{line.zh}</div>
              <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => speak(line.en)}>听这句</button>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <h3>场景小测 · {item.quizzes.length} 题</h3>
          {answered === item.quizzes.length ? (
            <p className="muted">本次答对 {correct} / {item.quizzes.length}</p>
          ) : null}
          {item.quizzes.map((q, qi) => (
            <div key={q.question} style={{ marginBottom: 16 }}>
              <p>{q.question}</p>
              {q.options.map((opt, oi) => (
                <button
                  key={opt}
                  className={`option ${answers[qi] != null ? (oi === q.answer ? "correct" : answers[qi] === oi ? "wrong" : "") : ""}`}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                >
                  {opt}
                </button>
              ))}
              {answers[qi] != null ? <p className="muted">{q.explain}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GRAMMAR_STAGES = ["全部", "A1", "A2", "B1", "B2"];

export function GrammarPage() {
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState("全部");
  useEffect(() => { api("/grammar").then(setItems); }, []);
  const shown = stage === "全部" ? items : items.filter((g) => g.stage === stage);
  const quizTotal = items.reduce((n, g) => n + (g.quizCount || 0), 0);
  return (
    <div>
      <p className="kicker">Grammar lab</p>
      <h1>语法专项：一次只攻一个点</h1>
      <p className="muted">现有 {items.length} 个专题、{quizTotal} 道练习，按 CEFR 从基础句型练到雅思阅读长句。</p>
      <div className="btn-group" style={{ margin: "14px 0 18px" }}>
        {GRAMMAR_STAGES.map((s) => (
          <button key={s} className={stage === s ? "btn moss" : "btn ghost"} onClick={() => setStage(s)}>{s}</button>
        ))}
      </div>
      <div className="grid grid-3">
        {shown.map((g) => (
          <Link key={g.slug} to={`/grammar/${g.slug}`} className="card">
            <div style={{ fontSize: 28 }}>{g.emoji}</div>
            <h3>{g.title}</h3>
            <p className="muted">{g.summary}</p>
            <p>{g.stage} · {g.quizCount} 题</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GrammarDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [answers, setAnswers] = useState({});
  useEffect(() => {
    setItem(null);
    setAnswers({});
    api(`/grammar/${slug}`).then(setItem);
  }, [slug]);
  if (!item) return <p>加载中…</p>;
  const answered = Object.keys(answers).length;
  const correct = item.quizzes.filter((q, qi) => answers[qi] === q.answer).length;
  return (
    <div className="grid grid-2">
      <div className="card">
        <p className="kicker">{item.stage} · {item.titleEn}</p>
        <h1>{item.emoji} {item.title}</h1>
        <p>{item.summary}</p>
        <ul>{item.points.map((p) => <li key={p}>{p}</li>)}</ul>
        {item.examples.map((ex) => (
          <div key={ex.en} className="card" style={{ boxShadow: "none" }}>
            <div className="serif">{ex.en}</div>
            <div className="muted">{ex.zh} · 关注 {ex.highlight}</div>
            <SpeakButton text={ex.en} />
          </div>
        ))}
      </div>
      <div className="card">
        <h3>即时练习 · {item.quizzes.length} 题</h3>
        {answered === item.quizzes.length ? (
          <p className="muted">本次答对 {correct} / {item.quizzes.length}</p>
        ) : null}
        {item.quizzes.map((q, qi) => (
          <div key={q.question} style={{ marginBottom: 16 }}>
            <p>{q.question}</p>
            {q.options.map((opt, oi) => (
              <button
                key={opt}
                className={`option ${answers[qi] != null ? (oi === q.answer ? "correct" : answers[qi] === oi ? "wrong" : "") : ""}`}
                onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
              >
                {opt}
              </button>
            ))}
            {answers[qi] != null ? <p className="muted">{q.explain}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PronouncePage() {
  const [words, setWords] = useState([]);
  const [i, setI] = useState(0);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState(null);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { api("/words").then(setWords); }, []);
  const word = words[i];

  async function listenMine() {
    setError("");
    try {
      const text = await recognizeEnglish();
      setHeard(text);
      setScore(scorePronunciation(word.lemma, text));
    } catch (e) {
      setError(e.message);
    }
  }

  function checkTyped() {
    setHeard(typed);
    setScore(scorePronunciation(word.lemma, typed));
  }

  if (!word) return <p>加载中…</p>;
  return (
    <div className="grid grid-2">
      <div className="card">
        <p className="kicker">Pronunciation</p>
        <h1 className="serif">{word.lemma}</h1>
        <p>{word.ipa} · {word.meaning}</p>
        <SpeakButton text={word.lemma} label="听标准发音" />
        <SpeakButton text={word.example} label="听例句" />
        <p className="muted">{word.example}</p>
      </div>
      <div className="card">
        <h3>跟读打分</h3>
        <p className="muted">Chrome 可用麦克风。其他浏览器可以打出你听到的单词。</p>
        {canRecognize() ? <button className="btn moss" onClick={listenMine}>开始跟读</button> : null}
        <label className="field" style={{ marginTop: 16 }}>
          键盘跟读
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="输入你听到的单词" />
        </label>
        <button className="btn ghost" onClick={checkTyped}>对照打分</button>
        {error ? <p style={{ color: "var(--persimmon)" }}>{error}</p> : null}
        {score != null ? (
          <div>
            <p className="score-ring serif">{score}</p>
            <p>识别结果：{heard || "（空）"}</p>
            <p className="muted">{score >= 80 ? "很接近，继续保持。" : "再听一遍，把元音拉长一点。"}</p>
          </div>
        ) : null}
        <button className="btn" style={{ marginTop: 12 }} onClick={() => { setI((n) => (n + 1) % words.length); setScore(null); setHeard(""); setTyped(""); }}>下一个</button>
      </div>
    </div>
  );
}
