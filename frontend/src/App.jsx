import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { Layout } from "./Layout.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { RootsPage, RootDetailPage, StudyPage, WordGroupPage, WordsPage } from "./pages/WordPages.jsx";
import { MemoryQuizPage } from "./pages/MemoryQuizPage.jsx";
import { GrammarDetailPage, GrammarPage, PronouncePage, ScenarioDetailPage, ScenariosPage } from "./pages/PracticePages.jsx";
import { DailyPage, ReviewPage } from "./pages/DailyPages.jsx";
import { TestRunPage, TestsPage } from "./pages/TestPages.jsx";

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-wrap">加载中…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={<Private><Layout /></Private>}
      >
        <Route index element={<HomePage />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="words/:slug" element={<WordGroupPage />} />
        <Route path="study/:kind/:slug" element={<StudyPage />} />
        <Route path="memory-quiz/:kind/:slug" element={<MemoryQuizPage />} />
        <Route path="roots" element={<RootsPage />} />
        <Route path="roots/:slug" element={<RootDetailPage />} />
        <Route path="scenarios" element={<ScenariosPage />} />
        <Route path="scenarios/:slug" element={<ScenarioDetailPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="grammar/:slug" element={<GrammarDetailPage />} />
        <Route path="pronounce" element={<PronouncePage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="tests" element={<TestsPage />} />
        <Route path="tests/:level" element={<TestRunPage />} />
      </Route>
    </Routes>
  );
}
