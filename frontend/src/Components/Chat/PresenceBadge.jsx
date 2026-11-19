import React from "react";

const PresenceBadge = ({ online = null, className = "" }) => {
  let statusClass = "unknown";
  let statusText = "Presence unknown";

  if (online === true) {
    statusClass = "online";
    statusText = "Online";
  } else if (online === false) {
    statusClass = "offline";
    statusText = "Offline";
  }

  return (
    <span
      className={`presence-badge ${statusClass} ${className}`}
      title={statusText}
      aria-label={statusText}
    />
  );
};

export default PresenceBadge;
