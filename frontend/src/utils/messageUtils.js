export const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  const first = new Date(date1);
  const second = new Date(date2);

  return first.toDateString() === second.toDateString();
};

export const getDateLabel = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return "";

  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

export const getMessageStatus = (message) => {
  if (!message) return "sent";

  if (message.read || message.isRead) return "read";
  if (message.delivered || message.isDelivered) return "delivered";

  return "sent";
};
