import React, { useState } from "react";
import { chatWithRag } from "../api";

export default function ExplainMode() {
  const [text, setText] = useState("");
  const [role, setRole] = useState("patient");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!text.trim()) return alert("Please enter text to explain.");
    setLoading(true);
    setOutput("");

    try {
      const resp = await chatWithRag(`Explain this medical text: ${text}`, role);
      setOutput(resp.answer);
    } catch (err) {
      console.error(err);
      setOutput("⚠️ Unable to generate explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explain-mode-page">
      <div className="explain-card">
        <h2 className="explain-title">🧠 Explain in Simple Terms</h2>
        <p className="explain-subtext">
          Paste medical content below and choose how you want it explained — 
          <strong> as a patient, a medical student, or a colleague</strong>.
        </p>

        <textarea
          placeholder="Paste or type the medical paragraph here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="explain-textarea"
        />

        <div className="explain-controls">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="patient">Explain like I’m a Patient 🩺</option>
            <option value="student">Explain like a Medical Student 📘</option>
            <option value="colleague">Explain like a Colleague 👨‍⚕️</option>
          </select>

          <button
            className="explain-btn"
            onClick={handleExplain}
            disabled={loading}
          >
            {loading ? "Explaining..." : "Explain"}
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Generating simplified explanation...</span>
          </div>
        )}

        {output && (
          <div className="explain-result fade-in">
            <h3>🩻 Simplified Explanation</h3>
            <p>{output}</p>
          </div>
        )}
      </div>
    </div>
  );
}
