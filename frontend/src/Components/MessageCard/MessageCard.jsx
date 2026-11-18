import React from "react";

const MessageCard = ({
  isReqUserMessage,
  content,
  timestamp,
  profilePic,
}) => {
  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  return (
    <div
      className={`flex w-full items-end gap-2 mb-2 ${
        isReqUserMessage ? "justify-start" : "justify-end"
      }`}
    >
      {/* Received message avatar */}
      {isReqUserMessage && (
        <img
          src={profilePic || defaultAvatar}
          alt="profile"
          onError={(event) => {
            event.currentTarget.src = defaultAvatar;
          }}
          className="h-8 w-8 shrink-0 rounded-full object-cover mb-1"
        />
      )}

      {/* Message bubble */}
      <div
        className={`relative max-w-[75%] sm:max-w-[65%] px-3 py-2 shadow-sm break-words ${
          isReqUserMessage
            ? "bg-white text-gray-800 rounded-2xl rounded-bl-sm"
            : "bg-[#d9fdd3] text-gray-800 rounded-2xl rounded-br-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>

        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-[10px] text-gray-500">
            {formatTime(timestamp)}
          </span>

          {!isReqUserMessage && (
            <span className="text-[11px] text-[#53a99b] font-semibold">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
