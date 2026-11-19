import React from "react";
import ChatCard from "../ChatCard/ChatCard";

const ChatList = ({
  querys,
  auth,
  chat,
  lastMessages,
  handleClickOnChatCard,
  handleCurrentChat,
}) => {
  const searchUsers = Array.isArray(auth?.searchUser)
    ? auth.searchUser
    : [];

  const chats = Array.isArray(chat?.chats) ? chat.chats : [];

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  const getChatName = (item) => {
    if (item.group) {
      return item.chatName || "Group Chat";
    }

    const otherUser = item.users?.find(
      (user) => user.id !== auth?.reqUser?.id
    );

    return otherUser?.name || "Unknown User";
  };

  const getChatImage = (item) => {
    if (item.group) {
      return item.chatImage || defaultAvatar;
    }

    const otherUser = item.users?.find(
      (user) => user.id !== auth?.reqUser?.id
    );

    return otherUser?.profile || defaultAvatar;
  };

  return (
    <div className="chattingo-chat-list bg-white overflow-y-auto h-full">
      {querys ? (
        searchUsers.length > 0 ? (
          <>
            <p className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Search Results
            </p>

            {searchUsers.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickOnChatCard(item.id)}
                className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
              >
                <ChatCard
                  name={item.name || "Unknown User"}
                  userImg={item.profile || defaultAvatar}
                  lastMessage={{
                    content: "Start your conversation",
                    timestamp: "",
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-gray-600">
              No users found
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Try searching with another name
            </p>
          </div>
        )
      ) : chats.length > 0 ? (
        <>
          <p className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Chats
          </p>

          {chats.map((item) => {
            const lastMessage = lastMessages?.[item.id];

            return (
              <div
                key={item.id}
                onClick={() => handleCurrentChat(item)}
                className="cursor-pointer border-b border-gray-100 transition hover:bg-[#f5f6f6]"
              >
                <ChatCard
                  name={getChatName(item)}
                  userImg={getChatImage(item)}
                  lastMessage={{
                    content:
                      lastMessage?.content || "Start your conversation",
                    timestamp: lastMessage?.timestamp || "",
                  }}
                />
              </div>
            );
          })}
        </>
      ) : (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">
            No chats available
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Search for a user to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatList;