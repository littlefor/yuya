import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { ProgressBar } from "../components.jsx";

export function HomePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    api("/progress").then(setProgress).catch(() => {});
    api("/learn/review-queue").then(setReview).catch(() => {});
  }, []);

  const stages = ["A1", "A2", "B1", "B2"];

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="kicker">今日学习</p>
          <h1 style={{ margin: 0 }}>{user?.name}，把英语放进生活里</h1>
        </div>
        <div className="chip">当前水平 {user?.level}</div>
      </div>

      <section className="hero">
        <div className="card">
          <p className="muted">像多邻国一样每天打卡，像百词斩一样看图记词，像 Anki 一样隔天复习。</p>
          <h2 className="serif" style={{ marginTop: 0 }}>今天 {user?.dailyMinutes} 分钟，够用一个场景。</h2>
          <div className="btn-group">
            <Link className="btn moss" to="/daily">开始今日训练</Link>
            <Link className="btn ghost" to="/review">复习昨天 {review?.yesterdayMissed || 0} + 到期 {review?.dueCount || 0}</Link>
          </div>
          <div className="grid grid-3" style={{ marginTop: 22 }}>
            <div><p className="muted">已学单词</p><p className="stat">{progress?.learned || 0}</p></div>
            <div><p className="muted">较熟</p><p className="stat">{progress?.mastered || 0}</p></div>
            <div><p className="muted">连续打卡</p><p className="stat">{user?.streak || 0}</p></div>
          </div>
        </div>
        <div className="card">
          <p className="kicker">阶段路径</p>
          <div className="path">
            {stages.map((s) => (
              <span key={s} className={user?.completedStages?.includes(s) ? "done" : s === user?.level ? "now" : ""}>
                {s}
              </span>
            ))}
          </div>
          <p className="muted">完成一个阶段后去测试，通过即可解锁下一关。</p>
          <ProgressBar value={(user?.completedStages?.length || 0) * 25} />
          <Link className="btn ghost" to="/tests" style={{ marginTop: 14, display: "inline-flex" }}>去水平测试</Link>
        </div>
      </section>

      <section className="grid grid-4">
        {[
          ["/words", "🥕", "分类记忆", "票据对照表、家居脑图，四级到雅思按主题记。"],
          ["/roots", "🧩", "词根词缀", "前缀、后缀、拉丁词根连成脑图，看见一块积木就能猜一串词。"],
          ["/scenarios", "✈️", "场景训练", "20 个生活场景，每段对话后有 8 道练习，从点咖啡练到开会。"],
          ["/grammar", "📘", "语法专项", "27 个专题，从 be 动词练到虚拟语气，四六级和雅思考点都能覆盖。"],
        ].map(([to, icon, title, desc]) => (
          <Link key={to} to={to} className="card">
            <div style={{ fontSize: 28 }}>{icon}</div>
            <h3>{title}</h3>
            <p className="muted">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
