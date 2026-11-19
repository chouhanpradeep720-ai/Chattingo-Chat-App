import React from "react";

const LastSeen = ({ lastSeen, online = null }) => {
  if (online === true) {
    return <span className="last-seen online-text">online</span>;
  }

  if (!lastSeen) {
    return (
      <span className="last-seen">
        {online === false ? "offline" : "Presence unavailable"}
      </span>
    );
  }

  const date = new Date(lastSeen);

  if (Number.isNaN(date.getTime())) {
    return <span className="last-seen">Last seen unavailable</span>;
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatted = isToday
    ? `today at ${time}`
    : date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
      }) + ` at ${time}`;

  return <span className="last-seen">last seen {formatted}</span>;
};

export default LastSeen;
