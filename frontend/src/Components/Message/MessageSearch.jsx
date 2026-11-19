import React, { useState, useMemo } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const MessageSearch = ({
  messages = [],
  onMessageClick,
  onClose,
}) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return messages.filter((message) =>
      (message.content || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [messages, query]);

  return (
    <div className="message-search-panel">
      <div className="message-search-input-wrapper">
        <AiOutlineSearch />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          autoFocus
        />

        <button
          type="button"
          onClick={onClose}
          title="Close search"
        >
          <AiOutlineClose />
        </button>
      </div>

      {query.trim() && (
        <div className="message-search-results">
          {results.length === 0 ? (
            <div className="message-search-empty">
              No messages found
            </div>
          ) : (
            results.map((message) => (
              <button
                type="button"
                className="message-search-result"
                key={message.id}
                onClick={() => onMessageClick?.(message)}
              >
                <div className="message-search-result-content">
                  {message.content}
                </div>

                <div className="message-search-result-time">
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleString()
                    : ""}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
