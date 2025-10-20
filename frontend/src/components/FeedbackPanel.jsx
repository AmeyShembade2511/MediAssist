import React, { useState } from "react";
import { sendFeedback } from "../api";

export default function FeedbackPanel({ lastAnswer }) {
  const [feedback, setFeedback] = useState("");
  const [correction, setCorrection] = useState("");

  const handleSubmit = async () => {
    if (!lastAnswer) return alert("No recent answer to review.");
    await sendFeedback({ answer: lastAnswer.text, feedback, correction });
    setFeedback("");
    setCorrection("");
    alert("Feedback submitted!");
  };

  return (
    <div className="feedback-panel">
      <h4>Flag or Suggest Correction</h4>
      <textarea
        placeholder="Feedback or issue..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <textarea
        placeholder="Ground truth correction (if any)..."
        value={correction}
        onChange={(e) => setCorrection(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
}
