import React from "react";

const TypingIndicator = ({ users = [], isTyping = false }) => {
  if (!isTyping && users.length === 0) return null;

  let text = "typing";

  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length > 1) {
    text = "Several people are typing";
  }

  return (
    <div className="typing-indicator">
      <span className="typing-dots">
        <span />
        <span />
        <span />
      </span>
      <span>{text}</span>
    </div>
  );
};

export default TypingIndicator;
