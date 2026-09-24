import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { SpeakButton, WordVisual } from "../components.jsx";
import { speak } from "../speech.js";

const EXAMS = [
  { id: "", label: "全部" },
  { id: "CET4", label: "四级" },
  { id: "CET6", label: "六级" },
  { id: "IELTS", label: "雅思" },
];

export function WordsPage() {
  const [cats, setCats] = useState([]);
  const [exam, setExam] = useState("");
  useEffect(() => { api("/categories").then(setCats); }, []);
  const shown = exam ? cats.filter((c) => c.examFocus === exam || (exam === "CET6" && c.examFocus === "CET4")) : cats;
  return (
    <div>
      <p className="kicker">Thematic vocabulary</p>
      <h1>按主题对照记：词表 + 脑图</h1>
      <p className="muted">像票据词表那样左中右对照，像「家」那样按房间连成网络。词库覆盖四级基础、六级进阶和雅思话题。</p>
      <div className="btn-group" style={{ margin: "14px 0 18px" }}>
        {EXAMS.map((e) => (
          <button key={e.id} className={exam === e.id ? "btn moss" : "btn ghost"} onClick={() => setExam(e.id)}>{e.label}</button>
        ))}
      </div>
      <div className="grid grid-4">
        {shown.map((c) => (
          <Link key={c.slug} to={`/words/${c.slug}`} className="card" style={{ borderTop: `6px solid ${c.color}` }}>
            <div style={{ fontSize: 36 }}>{c.emoji}</div>
            <h3>{c.name} <span className="muted">{c.nameEn}</span></h3>
            <p className="muted">{c.description}</p>
            <p>{c.wordCount} 词 · {examLabel(c.examFocus)} · {c.clusters?.length || 1} 组</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function examLabel(level) {
  return { CET4: "四级", CET6: "六级", IELTS: "雅思" }[level] || level;
}

export function WordGroupPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const kind = params.get("root") ? "root" : "category";
  const [words, setWords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [view, setView] = useState(slug === "home" ? "map" : "list");
  const [active, setActive] = useState(null);
  const [cluster, setCluster] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const q = kind === "root" ? `/words?root=${slug}` : `/words?category=${slug}`;
    api(q).then((list) => {
      setWords(list);
      setActive(list[0] || null);
    });
    if (kind === "root") api(`/roots/${slug}`).then(setMeta);
    else api("/categories").then((list) => setMeta(list.find((x) => x.slug === slug)));
  }, [slug, kind]);

  const clusters = useMemo(() => {
    const map = new Map();
    words.forEach((w) => {
      const key = w.cluster || "general";
      if (!map.has(key)) map.set(key, { slug: key, name: w.clusterName || key, words: [] });
      map.get(key).words.push(w);
    });
    return [...map.values()];
  }, [words]);

  const visible = cluster ? words.filter((w) => w.cluster === cluster) : words;

  return (
    <div>
      <p className="kicker">{meta?.affix || meta?.nameEn}</p>
      <h1>{meta?.name || meta?.affix || slug}</h1>
      <p className="muted">{meta?.description || meta?.tip} 本组 {words.length} 个词。</p>
      <div className="btn-group">
        <button className={view === "list" ? "btn moss" : "btn ghost"} onClick={() => setView("list")}>对照词表</button>
        <button className={view === "map" ? "btn moss" : "btn ghost"} onClick={() => setView("map")}>主题脑图</button>
        <button className="btn" onClick={() => nav(`/study/${kind}/${slug}${cluster ? `?cluster=${cluster}` : ""}`)}>开始记这组</button>
        <button
          className="btn moss"
          disabled={visible.length < 4}
          onClick={() => nav(`/memory-quiz/${kind}/${slug}${cluster ? `?cluster=${cluster}` : ""}`)}
        >
          记忆测试
        </button>
      </div>
      {clusters.length > 1 ? (
        <div className="btn-group" style={{ marginTop: 12 }}>
          <button className={!cluster ? "btn moss" : "btn ghost"} onClick={() => setCluster("")}>全部</button>
          {clusters.map((c) => (
            <button key={c.slug} className={cluster === c.slug ? "btn moss" : "btn ghost"} onClick={() => setCluster(c.slug)}>
              {c.name} {c.words.length}
            </button>
          ))}
        </div>
      ) : null}

      {view === "list" ? (
        <div className="word-sheet" style={{ marginTop: 18 }}>
          {visible.map((w) => (
            <button
              type="button"
              key={w._id}
              className={`word-row${active?._id === w._id ? " active" : ""}`}
              onClick={() => { setActive(w); speak(w.lemma); }}
            >
              <span className="word-row-icon" aria-hidden>{w.emoji}</span>
              <span className="word-row-zh">{w.meaning}</span>
              <span className="word-row-en">
                <strong>{w.lemma}</strong>
                <small>{w.ipa}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mindmap-board" style={{ marginTop: 18 }}>
          <div className="mindmap-center" style={{ borderColor: meta?.color }}>
            <div style={{ fontSize: 36 }}>{meta?.emoji || "🏠"}</div>
            <strong>{meta?.name || slug}</strong>
            <small>{meta?.nameEn}</small>
          </div>
          <div className="mindmap-petals">
            {clusters.filter((c) => !cluster || c.slug === cluster).map((c) => (
              <div key={c.slug} className="mindmap-petal">
                <h4>{c.name}</h4>
                {c.words.map((w) => (
                  <button type="button" key={w._id} className="mindmap-word" onClick={() => { setActive(w); speak(w.lemma); }}>
                    <span>{w.emoji}</span>
                    <b>{w.lemma}</b>
                    <i>{w.meaning}</i>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {active ? (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="kicker">{examLabel(active.examLevel)} · {active.clusterName} · {active.pos}</p>
          <h2 className="serif" style={{ margin: "6px 0" }}>{active.lemma} <span className="muted">{active.ipa}</span></h2>
          <p>{active.meaning}</p>
          <p className="muted">{active.example} — {active.exampleZh}</p>
          <SpeakButton text={`${active.lemma}. ${active.example}`} />
        </div>
      ) : null}
    </div>
  );
}

export function RootsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api("/roots").then(setData); }, []);
  if (!data) return <p>加载中…</p>;
  return (
    <div>
      <p className="kicker">Morphology mind map</p>
      <h1>词根词缀脑图</h1>
      <p className="muted">中间是总开关，三条主干：前缀、后缀、拉丁/希腊词根。点进某一个，再以它为中心展开例词。共 {data.total} 组。</p>
      <div className="mindmap-board root-overview">
        <div className="mindmap-center" style={{ borderColor: "#3D8B6E" }}>
          <div style={{ fontSize: 36 }}>🧩</div>
          <strong>词根词缀</strong>
          <small>Morphology</small>
        </div>
        <div className="root-families">
          {data.families.map((fam) => (
            <section key={fam.type} className={`root-family root-family-${fam.type}`}>
              <h2>{fam.emoji} {fam.name}</h2>
              {fam.groups.map((g) => (
                <div key={g.slug} className="mindmap-petal">
                  <h4>{g.name}</h4>
                  {g.roots.map((r) => (
                    <Link key={r.slug} to={`/roots/${r.slug}`} className="mindmap-word">
                      <span>{r.emoji}</span>
                      <b style={{ color: r.color }}>{r.affix}</b>
                      <i>{r.meaning}</i>
                    </Link>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RootDetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [root, setRoot] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api(`/roots/${slug}`).then((data) => {
      setRoot(data);
      setActive(data.examples?.[0] || null);
    });
  }, [slug]);

  if (!root) return <p>加载中…</p>;
  return (
    <div>
      <p className="kicker">{root.familyName} · {root.groupName}</p>
      <h1>{root.emoji} {root.affix}</h1>
      <p>{root.meaning} <span className="muted">({root.meaningEn})</span></p>
      <p className="muted">{root.tip}</p>
      <div className="btn-group">
        <Link className="btn ghost" to="/roots">返回总脑图</Link>
        <button className="btn moss" onClick={() => nav(`/study/root/${root.slug}`)}>开始记这组例词</button>
        <button className="btn" disabled={(root.examples || []).length < 4} onClick={() => nav(`/memory-quiz/root/${root.slug}`)}>记忆测试</button>
      </div>
      <div className="mindmap-board" style={{ marginTop: 18 }}>
        <div className="mindmap-center" style={{ borderColor: root.color }}>
          <div style={{ fontSize: 32 }}>{root.emoji}</div>
          <strong style={{ color: root.color }}>{root.affix}</strong>
          <small>{root.meaning}</small>
        </div>
        <div className="mindmap-petals">
          {root.examples.map((w) => (
            <button
              type="button"
              key={w.lemma}
              className={`mindmap-word${active?.lemma === w.lemma ? " on" : ""}`}
              onClick={() => { setActive(w); speak(w.lemma); }}
            >
              <span>{w.emoji}</span>
              <b>{w.lemma}</b>
              <i>{w.meaning}</i>
            </button>
          ))}
        </div>
      </div>
      {active ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 className="serif">{active.lemma} <span className="muted">{active.ipa}</span></h2>
          <p>{active.meaning}</p>
          {active.breakdown ? <p className="muted">拆分：{active.breakdown}</p> : null}
          <SpeakButton text={active.lemma} />
        </div>
      ) : null}
    </div>
  );
}

export function StudyPage() {
  const { kind, slug } = useParams();
  const [params] = useSearchParams();
  const cluster = params.get("cluster") || "";
  const [words, setWords] = useState(null);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (kind === "root") {
      api(`/roots/${slug}`).then((data) => {
        setWords((data.examples || []).map((w, idx) => ({
          ...w,
          _id: w._id || `ex-${idx}`,
          pos: data.affix,
          example: w.breakdown ? `${w.breakdown}` : `${data.affix}`,
          exampleZh: data.meaning,
          examLevel: "CET6",
          clusterName: data.groupName,
        })));
      });
      return;
    }
    const q = new URLSearchParams();
    q.set("category", slug);
    if (cluster) q.set("cluster", cluster);
    api(`/words?${q.toString()}`).then((list) => setWords(list));
  }, [kind, slug, cluster]);

  const word = words?.[i];
  const options = useMemo(() => {
    if (!word || !words?.length) return [];
    const others = shuffle(words.filter((w) => w._id !== word._id).map((w) => w.meaning)).slice(0, 3);
    return shuffle([word.meaning, ...others]);
  }, [word, words]);

  async function answer(meaning) {
    if (picked) return;
    setPicked(meaning);
    setRevealed(true);
    if (meaning === word.meaning) setDone((n) => n + 1);
  }

  async function rate(result) {
    if (word._id && !String(word._id).startsWith("ex-")) {
      await api("/learn/review", { method: "POST", body: JSON.stringify({ wordId: word._id, result }) });
    }
    next();
  }

  function next() {
    setPicked(null);
    setRevealed(false);
    setI((n) => n + 1);
  }

  if (!words) return <p>加载中…</p>;
  if (!word) {
    return (
      <div className="card">
        <h1>本组词已经过完一遍</h1>
        <p>答对 {done} 个。接着做一轮记忆测试，会更牢。</p>
        <div className="btn-group">
          <Link className="btn moss" to={`/memory-quiz/${kind}/${slug}${cluster ? `?cluster=${cluster}` : ""}`}>去做记忆测试</Link>
          <Link className="btn ghost" to="/review">去复习队列</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <p className="muted">{i + 1} / {words.length} · {word.clusterName} · {examLabel(word.examLevel)}</p>
        <WordVisual emoji={word.emoji} ipa={revealed ? word.ipa : "???"} lemma={revealed ? word.lemma : ""} />
      </div>
      <div className="card">
        <p className="kicker">{word.pos}</p>
        {revealed ? (
          <>
            <h1 className="lemma serif">{word.lemma}</h1>
            <p>{word.meaning}</p>
            <p className="muted">{word.example} — {word.exampleZh}</p>
            <SpeakButton text={`${word.lemma}. ${word.example}`} />
            <div className="btn-group" style={{ marginTop: 16 }}>
              <button className="btn warn" onClick={() => rate("unknown")}>不认识</button>
              <button className="btn ghost" onClick={() => rate("fuzzy")}>模糊</button>
              <button className="btn moss" onClick={() => rate("known")}>认识</button>
            </div>
          </>
        ) : (
          <>
            <h2>看图选中文</h2>
            {options.map((opt) => (
              <button
                key={opt}
                className={`option ${picked ? (opt === word.meaning ? "correct" : picked === opt ? "wrong" : "") : ""}`}
                onClick={() => answer(opt)}
              >
                {opt}
              </button>
            ))}
            <button className="btn ghost" onClick={() => setRevealed(true)}>直接看答案</button>
          </>
        )}
      </div>
    </div>
  );
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}
