import React, { useState } from "react";
import { chatWithRag } from "../api";

export default function SummarizeProtocol() {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    const resp = await chatWithRag(
      `Summarize this medical protocol: ${query}. Include key steps and citations.`,
      "doctor"
    );
    setSummary(resp.answer);
  };

  return (
    <div className="summarize-protocol">
      <h2>🩺 Summarize Medical Protocol</h2>
      <textarea
        placeholder="Enter the condition or guideline name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSummarize}>Summarize</button>
      {summary && <div className="result-box">{summary}</div>}
    </div>
  );
}
