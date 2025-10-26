import React, { useState } from "react";
import { chatWithRag } from "../api";
import "../index.css";

export default function CompareDrugs() {
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!drugA.trim() || !drugB.trim()) return alert("Please enter both drug names.");
    setLoading(true);
    setResult("");

    const query = `Compare ${drugA} vs ${drugB} in terms of mechanism, indications, contraindications, dosage, side effects, and interactions.`;

    try {
      const resp = await chatWithRag(query, "doctor");
      setResult(resp.answer);
    } catch (err) {
      setResult("⚠️ Unable to fetch comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compare-drugs">
      <h2 className="compare-title">💊 Compare Two Drugs</h2>

      <div className="drug-inputs">
        <input
          type="text"
          placeholder="Enter Drug A"
          value={drugA}
          onChange={(e) => setDrugA(e.target.value)}
          className="drug-input"
        />
        <span className="vs-label">vs</span>
        <input
          type="text"
          placeholder="Enter Drug B"
          value={drugB}
          onChange={(e) => setDrugB(e.target.value)}
          className="drug-input"
        />
      </div>

      <button className="compare-btn" onClick={handleCompare} disabled={loading}>
        {loading ? "Comparing..." : "Compare"}
      </button>

      {result && (
        <div className="result-box fade-in">
          <h4 className="result-title">Comparison Result</h4>
          <p className="result-text">{result}</p>
        </div>
      )}
    </div>
  );
}
