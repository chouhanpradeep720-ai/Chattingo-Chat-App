import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const DEFAULT_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🙏"];

const MessageReactions = ({
  reactions = [],
  onReact,
  showPicker = false,
  onTogglePicker,
}) => {
  const normalizedReactions = Array.isArray(reactions)
    ? reactions
    : [];

  return (
    <div className="message-reactions-wrapper">
      {normalizedReactions.length > 0 && (
        <div className="message-reactions">
          {normalizedReactions.map((reaction, index) => (
            <button
              type="button"
              key={`${reaction.emoji || reaction.type}-${index}`}
              className={`reaction-chip ${
                reaction.reactedByMe ? "active" : ""
              }`}
              onClick={() => onReact?.(reaction.emoji || reaction.type)}
              title={`${reaction.count || 1} reaction(s)`}
            >
              <span>{reaction.emoji || reaction.type}</span>
              {reaction.count > 1 && (
                <span className="reaction-count">
                  {reaction.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {showPicker && (
        <div className="reaction-picker">
          {DEFAULT_REACTIONS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => {
                onReact?.(emoji);
                onTogglePicker?.();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {onTogglePicker && (
        <button
          type="button"
          className="reaction-add-button"
          onClick={onTogglePicker}
          title="Add reaction"
        >
          <AiOutlinePlus />
        </button>
      )}
    </div>
  );
};

export default MessageReactions;
