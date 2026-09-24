import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { speak } from "../speech.js";

export function MemoryQuizPage() {
  const { kind, slug } = useParams();
  const [params] = useSearchParams();
  const cluster = params.get("cluster") || "";
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams();
    if (kind === "root") q.set("root", slug);
    else q.set("category", slug);
    if (cluster) q.set("cluster", cluster);
    api(`/practice/memory-quiz?${q.toString()}`)
      .then((data) => {
        setQuiz(data);
        setI(0);
        setPicked(null);
        setCorrect(0);
        setMissed([]);
        setDone(false);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, [kind, slug, cluster]);

  if (error) {
    return (
      <div className="card">
        <h1>还不能开测</h1>
        <p>{error}</p>
        <Link className="btn moss" to={kind === "root" ? `/roots/${slug}` : `/words/${slug}`}>返回这组词</Link>
      </div>
    );
  }
  if (!quiz) return <p>出题中…</p>;

  const q = quiz.questions[i];
  const score = quiz.total ? Math.round((correct / quiz.total) * 100) : 0;

  async function choose(oi) {
    if (picked != null) return;
    setPicked(oi);
    const ok = oi === q.answer;
    if (ok) setCorrect((n) => n + 1);
    else setMissed((list) => [...list, q]);
    if (q.wordId && !String(q.wordId).startsWith("ex-")) {
      api("/learn/review", {
        method: "POST",
        body: JSON.stringify({ wordId: q.wordId, result: ok ? "known" : "unknown" }),
      }).catch(() => {});
    }
  }

  function next() {
    if (i + 1 < quiz.questions.length) {
      setI((n) => n + 1);
      setPicked(null);
      return;
    }
    setDone(true);
  }

  if (done) {
    const passed = score >= quiz.passScore;
    const back = kind === "root" ? `/roots/${slug}` : `/words/${slug}`;
    return (
      <div className="card">
        <p className="kicker">{passed ? "记得不错" : "再过一遍会更牢"}</p>
        <h1>{quiz.title}</h1>
        <p className="score-ring serif">{score}</p>
        <p>答对 {correct} / {quiz.total}，及格线 {quiz.passScore} 分。错题会更快进入复习队列。</p>
        {missed.length ? (
          <div style={{ marginTop: 16 }}>
            <h3>需要再记的词</h3>
            {missed.map((item) => (
              <div key={`${item.wordId}-${item.prompt}`} className="card" style={{ boxShadow: "none", marginTop: 10 }}>
                <p><strong>{item.lemma}</strong> <span className="muted">{item.ipa}</span></p>
                <p>{item.meaning}</p>
                {item.example ? <p className="muted">{item.example} — {item.exampleZh}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">这组全对，间隔重复会把它们排得更后。</p>
        )}
        <div className="btn-group" style={{ marginTop: 18 }}>
          <button className="btn moss" onClick={() => window.location.reload()}>再测一轮</button>
          <button className="btn ghost" onClick={() => nav(back)}>返回词表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="kicker">{quiz.title}</p>
      <p className="muted">{i + 1} / {quiz.total} · {q.type === "en2zh" ? "英译中" : "中译英"} · 已对 {correct}</p>
      <div style={{ fontSize: 36, margin: "8px 0 4px" }}>{q.emoji}</div>
      <h2>{q.prompt}</h2>
      {q.type === "en2zh" || picked != null ? (
        <button className="btn ghost" onClick={() => speak(q.lemma)} type="button">听发音</button>
      ) : null}
      {q.options.map((opt, oi) => (
        <button
          key={`${opt}-${oi}`}
          className={`option ${picked == null ? "" : oi === q.answer ? "correct" : picked === oi ? "wrong" : ""}`}
          onClick={() => choose(oi)}
        >
          {opt}
        </button>
      ))}
      {picked != null ? (
        <div className="btn-group" style={{ marginTop: 12 }}>
          <p className="muted" style={{ flex: 1 }}>
            {picked === q.answer ? "答对了。" : `正确是「${q.options[q.answer]}」。`} {q.lemma} / {q.meaning}
          </p>
          <button className="btn moss" onClick={next}>{i + 1 < quiz.total ? "下一题" : "看成绩"}</button>
        </div>
      ) : null}
    </div>
  );
}
