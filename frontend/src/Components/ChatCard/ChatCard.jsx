import React from "react";

const ChatCard = ({ userImg, name, lastMessage }) => {
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f6f6]">
      <div className="relative shrink-0">
        <img
          src={userImg || defaultAvatar}
          alt={name || "Profile"}
          onError={(event) => {
            event.currentTarget.src = defaultAvatar;
          }}
          className="h-12 w-12 rounded-full border border-gray-100 object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-gray-800">
            {name || "Unknown User"}
          </p>

          <span className="shrink-0 text-[11px] text-gray-500">
            {formatTimestamp(lastMessage?.timestamp)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-[13px] text-gray-500">
            {lastMessage?.content || "Start your conversation"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
