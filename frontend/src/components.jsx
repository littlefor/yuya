import { speak } from "./speech.js";

export function WordVisual({ emoji, color = "#3D8B6E", ipa, lemma }) {
  return (
    <div
      className="word-visual"
      style={{
        background: `radial-gradient(circle at 30% 20%, #fff8ea, ${color} 78%)`,
      }}
    >
      <div className="emoji" aria-hidden>{emoji}</div>
      {ipa ? <div className="ipa">{ipa}{lemma ? ` · ${lemma}` : ""}</div> : null}
    </div>
  );
}

export function SpeakButton({ text, label = "听发音" }) {
  return (
    <button type="button" className="btn ghost" onClick={() => speak(text)}>
      🔊 {label}
    </button>
  );
}

export function ProgressBar({ value }) {
  return <div className="progress-bar"><span style={{ width: `${Math.min(100, value || 0)}%` }} /></div>;
}
