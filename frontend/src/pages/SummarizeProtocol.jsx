import React, { useState } from "react";
import { chatWithRag } from "../api";
import "../index.css";

export default function SummarizeProtocol() {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!query.trim()) return alert("Please enter a medical topic or protocol.");
    setLoading(true);
    setSummary("");

    try {
      const resp = await chatWithRag(
        `Summarize this medical protocol: ${query}. Include key steps and explain in short.`,
        "doctor"
      );
      setSummary(resp.answer);
    } catch (err) {
      console.error(err);
      setSummary("⚠️ Unable to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarize-page">
      <div className="summarize-card">
        <h2 className="summarize-title">🩺 Summarize Medical Protocol</h2>

        <p className="summarize-subtext">
          Enter a <strong>disease, condition, or treatment protocol</strong> — MediAssist will extract and simplify the main steps for you.
        </p>

        <div className="input-section">
          <input
            type="text"
            placeholder="e.g., Management of Hypertension"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="query-input"
          />
          <button
            className="summarize-btn"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Analyzing protocol...</span>
          </div>
        )}

        {summary && (
          <div className="summary-output fade-in">
            <h3>🧾 Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
