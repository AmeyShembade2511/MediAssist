import React, { useState } from "react";
import { chatWithRag } from "../api";

export default function CompareDrugs() {
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [result, setResult] = useState("");

  const handleCompare = async () => {
    const query = `Compare ${drugA} vs ${drugB} in terms of mechanism, indications, contraindications, dosage, side effects, and interactions.`;
    const resp = await chatWithRag(query, "doctor");
    setResult(resp.answer);
  };

  return (
    <div className="compare-drugs">
      <h2>💊 Compare Two Drugs</h2>
      <input placeholder="Drug A" value={drugA} onChange={(e) => setDrugA(e.target.value)} />
      <input placeholder="Drug B" value={drugB} onChange={(e) => setDrugB(e.target.value)} />
      <button onClick={handleCompare}>Compare</button>
      {result && <div className="result-box">{result}</div>}
    </div>
  );
}
