import React, { useState } from "react";
import {
  AiOutlinePushpin,
  AiOutlineClose,
  AiOutlineRight,
} from "react-icons/ai";

const PinnedMessages = ({
  messages = [],
  onUnpin,
  onMessageClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!messages || messages.length === 0) {
    return null;
  }

  const pinnedMessages = expanded
    ? messages
    : messages.slice(0, 1);

  return (
    <div className="pinned-messages-container">
      <div className="pinned-messages-header">
        <AiOutlinePushpin />

        <span>
          Pinned messages ({messages.length})
        </span>

        {messages.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="pinned-expand-button"
          >
            {expanded ? "Show less" : "View all"}
          </button>
        )}
      </div>

      {pinnedMessages.map((message) => (
        <div
          key={message.id}
          className="pinned-message-item"
        >
          <button
            type="button"
            className="pinned-message-content"
            onClick={() => onMessageClick?.(message)}
          >
            <span className="pinned-message-text">
              {message.content || "Attachment"}
            </span>

            <AiOutlineRight />
          </button>

          {onUnpin && (
            <button
              type="button"
              className="pinned-unpin-button"
              title="Unpin message"
              onClick={() => onUnpin(message)}
            >
              <AiOutlineClose />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PinnedMessages;
