import React from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <MessageBubble key={i} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
}
