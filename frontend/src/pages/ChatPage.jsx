import React, { useState } from "react";
import { chatWithRag } from "../api";
import RoleToggle from "../components/RoleToggle";
import FeedbackPanel from "../components/FeedbackPanel";
import "../index.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState("doctor");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    const resp = await chatWithRag(input, role);
    const botMsg = { sender: "bot", text: resp.answer };
    setMessages((m) => [...m, botMsg]);
    setLoading(false);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>MediAssist Chat</h2>
      <RoleToggle role={role} onChange={setRole} />
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "msg-user" : "msg-bot"}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="msg-bot">Thinking...</div>}
      </div>
      <div className="input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your question..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <FeedbackPanel lastAnswer={messages.at(-1)} />
    </div>
  );
}
