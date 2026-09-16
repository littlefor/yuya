import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const links = [
  ["/", "今日", "🏠"],
  ["/words", "分类单词", "🥕"],
  ["/roots", "词根词缀", "🧩"],
  ["/scenarios", "场景训练", "✈️"],
  ["/grammar", "语法专项", "📘"],
  ["/pronounce", "发音训练", "🎤"],
  ["/review", "复习", "🔁"],
  ["/daily", "每日打卡", "✅"],
  ["/tests", "水平测试", "🎓"],
];

export function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">芽</div>
          <div>
            <strong>语芽</strong>
            <small>LINGUASEED</small>
          </div>
        </div>
        {links.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <span>{icon}</span>{label}
          </NavLink>
        ))}
        <div style={{ marginTop: 24 }}>
          <div className="chip">🔥 {user?.streak || 0} 天连续</div>
          <div className="chip" style={{ marginTop: 8 }}>⭐ {user?.xp || 0} XP · {user?.level}</div>
          <button className="btn ghost" style={{ marginTop: 16 }} onClick={logout}>退出</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        {links.slice(0, 5).map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>{label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
