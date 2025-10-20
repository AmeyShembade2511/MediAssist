import React, { useState } from "react";
import { chatWithRag } from "../api";

export default function ExplainMode() {
  const [text, setText] = useState("");
  const [role, setRole] = useState("patient");
  const [output, setOutput] = useState("");

  const handleExplain = async () => {
    const resp = await chatWithRag(`Explain this: ${text}`, role);
    setOutput(resp.answer);
  };

  return (
    <div className="explain-mode">
      <h2>🧠 Explain in Simple Terms</h2>
      <textarea
        placeholder="Paste medical text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="patient">Patient</option>
        <option value="student">Medical Student</option>
        <option value="colleague">Colleague</option>
      </select>
      <button onClick={handleExplain}>Explain</button>
      {output && <div className="result-box">{output}</div>}
    </div>
  );
}
