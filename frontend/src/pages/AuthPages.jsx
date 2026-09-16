import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@linguaseed.app");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <p className="kicker">LinguaSeed</p>
        <h1>语芽，用科学方法把英语种起来</h1>
        <p className="muted">分类记忆、词根联想、场景开口、间隔复习。先从今天的 15 分钟开始。</p>
        <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
          <label className="field">邮箱<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field">密码<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error ? <p className="muted" style={{ color: "var(--persimmon)" }}>{error}</p> : null}
          <button className="btn moss" type="submit">进入学习</button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          还没有账号？<Link to="/register">注册</Link>
          <br />体验账号已填好：demo@linguaseed.app / demo123
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      nav("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1>创建你的语芽账号</h1>
        <form onSubmit={onSubmit}>
          <label className="field">昵称<input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="field">邮箱<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field">密码<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error ? <p style={{ color: "var(--persimmon)" }}>{error}</p> : null}
          <button className="btn moss" type="submit">开始学习</button>
        </form>
        <p className="muted"><Link to="/login">已有账号？登录</Link></p>
      </div>
    </div>
  );
}
