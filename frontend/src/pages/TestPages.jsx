import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { speak } from "../speech.js";

export function TestsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api("/tests").then(setData); }, []);
  if (!data) return <p>加载中…</p>;
  return (
    <div>
      <p className="kicker">Placement & checkpoints</p>
      <h1>每个阶段结束，测一测真实水平</h1>
      <p className="muted">参考 CEFR：A1 入门 → A2 基础旅行英语 → B1 能独立沟通 → B2 更稳。通过后解锁下一阶段。</p>
      <div className="grid grid-2">
        {data.tests.map((t) => (
          <div key={t.level} className="card">
            <h3>{t.title}</h3>
            <p className="muted">{t.description}</p>
            <p>{t.questionCount} 题 · 及格 {t.passScore} 分 · 最高 {t.bestScore || 0}</p>
            {t.unlocked ? (
              <Link className="btn moss" to={`/tests/${t.level}`}>开始测试</Link>
            ) : (
              <button className="btn ghost" disabled>先完成前一阶段</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestRunPage() {
  const { level } = useParams();
  const { setUser } = useAuth();
  const nav = useNavigate();
  const [test, setTest] = useState(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/tests/${level}`).then(setTest).catch((e) => setError(e.message));
  }, [level]);

  if (error) return <div className="card"><p>{error}</p><Link to="/tests">返回</Link></div>;
  if (!test) return <p>加载中…</p>;

  const q = test.questions[i];

  async function choose(oi) {
    const next = [...answers];
    next[i] = oi;
    setAnswers(next);
    if (i + 1 < test.questions.length) setI(i + 1);
    else {
      const data = await api(`/tests/${level}/submit`, { method: "POST", body: JSON.stringify({ answers: next }) });
      setResult(data);
      setUser(data.user);
    }
  }

  if (result) {
    return (
      <div className="card">
        <p className="kicker">{result.passed ? "通过" : "再练一轮"}</p>
        <p className="score-ring serif">{result.score}</p>
        <p>及格线 {result.passScore}。{result.passed ? "下一阶段已解锁。" : "建议先把错题对应的分类和语法再过一遍。"}</p>
        {result.review.filter((r) => !r.correct).map((r) => (
          <div key={r.index} className="card" style={{ boxShadow: "none" }}>
            <p>{r.prompt}</p>
            <p>你的答案：{r.options[r.yours] || "未作答"}</p>
            <p>正确：{r.options[r.answer]}</p>
            <p className="muted">{r.explain}</p>
          </div>
        ))}
        <div className="btn-group">
          <button className="btn moss" onClick={() => nav("/tests")}>返回关卡</button>
          <button className="btn ghost" onClick={() => { setResult(null); setI(0); setAnswers([]); }}>再测一次</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="muted">{test.title} · {i + 1}/{test.questions.length} · {q.type}</p>
      <h2>{q.prompt}</h2>
      {q.audioText ? <button className="btn ghost" onClick={() => speak(q.audioText)}>播放听力</button> : null}
      {q.options.map((opt, oi) => (
        <button key={opt} className="option" onClick={() => choose(oi)}>{opt}</button>
      ))}
    </div>
  );
}
