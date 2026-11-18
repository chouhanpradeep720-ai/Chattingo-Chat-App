import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";
import SockJs from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import EmojiPicker from "emoji-picker-react";

import Profile from "./Profile/Profile";
import CreateGroup from "./Group/CreateGroup";
import ProfileSection from "./HomeComponents/ProfileSection";
import SearchBar from "./HomeComponents/SearchBar";
import ChatList from "./HomeComponents/ChatList";
import MessageCard from "./MessageCard/MessageCard";

import {
  AiOutlineSearch,
  AiOutlineArrowLeft,
} from "react-icons/ai";

import {
  BsEmojiSmile,
  BsThreeDotsVertical,
  BsSendFill,
} from "react-icons/bs";

import { BASE_API_URL } from "../config/api";

function HomePage() {
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { auth, chat, message } = useSelector((store) => store);

  const token = localStorage.getItem("token");

  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  const messageContainerRef = useRef(null);
  const stompClientRef = useRef(null);

  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }

    return null;
  }

  // Scroll to latest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket connection
  const connect = () => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJs(`${BASE_API_URL}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },

      onConnect: () => {
        console.log("Chattingo WebSocket Connected");
        setIsConnected(true);
      },

      onDisconnect: () => {
        setIsConnected(false);
      },

      onStompError: (error) => {
        console.error("STOMP Error:", error);
      },

      onWebSocketError: (error) => {
        console.error("WebSocket Error:", error);
      },

      debug: (str) => {
        console.log("STOMP:", str);
      },
    });

    stompClientRef.current = client;
    setStompClient(client);

    client.activate();
  };

  // Receive WebSocket messages
  const onMessageReceive = (payload) => {
    try {
      const receivedMessage = JSON.parse(payload.body);

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (msg) => msg.id === receivedMessage.id
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, receivedMessage];
      });

      if (receivedMessage.chat?.id) {
        setLastMessages((previous) => ({
          ...previous,
          [receivedMessage.chat.id]: receivedMessage,
        }));
      }
    } catch (error) {
      console.error("Error receiving message:", error);
    }
  };

  // Establish WebSocket connection
  useEffect(() => {
    connect();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, []);

  // Subscribe to selected chat
  useEffect(() => {
    if (!isConnected || !stompClient || !currentChat?.id) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/topic/chat/${currentChat.id}`,
      onMessageReceive
    );

    console.log(`Subscribed to chat: ${currentChat.id}`);

    return () => {
      subscription.unsubscribe();
      console.log(`Unsubscribed from chat: ${currentChat.id}`);
    };
  }, [isConnected, stompClient, currentChat?.id]);

  // Fetch selected chat messages
  useEffect(() => {
    if (!currentChat?.id) {
      setMessages([]);
      return;
    }

    setMessages([]);

    dispatch(
      getAllMessages({
        chatId: currentChat.id,
        token,
      })
    );
  }, [currentChat?.id, token, dispatch]);

  // Update messages from Redux
  useEffect(() => {
    if (!Array.isArray(message.messages) || !currentChat?.id) {
      return;
    }

    const currentChatMessages = message.messages.filter(
      (msg) => msg.chat?.id === currentChat.id
    );

    setMessages(currentChatMessages);
  }, [message.messages, currentChat?.id]);

  // Fetch user's chats
  useEffect(() => {
    if (token) {
      dispatch(getUsersChat({ token }));
    }
  }, [token, chat.createdChat, chat.createdGroup, dispatch]);

  // Automatically open newly created chat
  useEffect(() => {
    if (chat.createdChat?.id) {
      setCurrentChat(chat.createdChat);
      setQuerys("");
    }
  }, [chat.createdChat]);

  // Fetch current user
  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  // User menu handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Open selected chat
  const handleCurrentChat = (item) => {
    setCurrentChat(item);
    setShowEmojiPicker(false);
  };

  // Search users
  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      dispatch(searchUser({ keyword: "", token }));
      return;
    }

    setCurrentChat(null);
    dispatch(searchUser({ keyword, token }));
  };

  // Create or open one-to-one chat
  const handleClickOnChatCard = (userId) => {
    if (!userId) return;

    dispatch(
      createChat({
        token,
        data: { userId },
      })
    );
  };

  // Send message
  const handleCreateNewMessage = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || !currentChat?.id) {
      return;
    }

    dispatch(
      createMessage({
        token,
        data: {
          chatId: currentChat.id,
          content: trimmedContent,
        },
      })
    );

    setContent("");
    setShowEmojiPicker(false);
  };

  // Add selected emoji to input
  const handleEmojiClick = (emojiData) => {
    setContent((previous) => previous + emojiData.emoji);
  };

  // Open profile
  const handleNavigate = () => {
    setIsProfile(true);
    setIsGroup(false);
    setAnchorEl(null);
  };

  // Close profile
  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  // Open group creation
  const handleCreateGroup = () => {
    setIsGroup(true);
    setIsProfile(false);
    setAnchorEl(null);
  };

  // Back to chat list on mobile
  const handleBackToChats = () => {
    setCurrentChat(null);
    setShowEmojiPicker(false);
  };

  // Logout
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setIsConnected(false);
    dispatch(logoutAction());
    navigate("/signin");
  };

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  // Get chat participant
  const otherUser = currentChat?.users?.find(
    (user) => user?.id !== auth?.reqUser?.id
  );

  const chatName = currentChat?.group
    ? currentChat?.chatName || "Group Chat"
    : otherUser?.name || "Chat";

  const chatImage = currentChat?.group
    ? currentChat?.chat_image
    : otherUser?.profile;

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  return (
    <div className="chattingo-page">
      <div className="chattingo-top-bar"></div>

      <div className="chattingo-container">

        {/* LEFT SIDEBAR */}
        <aside
          className={`chattingo-sidebar ${
            currentChat?.id ? "mobile-hide-sidebar" : ""
          }`}
        >
          {isProfile && (
            <div className="h-full w-full">
              <Profile
                handleCloseOpenProfile={handleCloseOpenProfile}
              />
            </div>
          )}

          {isGroup && (
            <div className="h-full w-full">
              <CreateGroup setIsGroup={setIsGroup} />
            </div>
          )}

          {!isProfile && !isGroup && (
            <>
              <ProfileSection
                auth={auth}
                handleNavigate={handleNavigate}
                handleClick={handleClick}
                handleCreateGroup={handleCreateGroup}
                handleLogout={handleLogout}
                handleClose={handleClose}
                open={open}
                anchorEl={anchorEl}
              />

              <div className="chattingo-search-wrapper">
                <SearchBar
                  querys={querys}
                  setQuerys={setQuerys}
                  handleSearch={handleSearch}
                />
              </div>

              <div className="chattingo-chat-list">
                <ChatList
                  querys={querys}
                  auth={auth}
                  chat={chat}
                  lastMessages={lastMessages}
                  handleClickOnChatCard={handleClickOnChatCard}
                  handleCurrentChat={handleCurrentChat}
                />
              </div>
            </>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main
          className={`chattingo-main ${
            currentChat?.id ? "mobile-show-chat" : ""
          }`}
        >
          {!currentChat?.id ? (
            <div className="chattingo-welcome">
              <div className="chattingo-welcome-content">
                <div className="chattingo-welcome-logo">
                  <span>Ch</span>
                </div>

                <h1>Welcome to Chattingo</h1>

                <p>
                  Connect with people, share messages and stay in touch.
                  Your conversations are just one click away.
                </p>

                <div className="chattingo-welcome-status">
                  <span></span>
                  Your personal messaging space
                </div>
              </div>
            </div>
          ) : (
            <section className="chattingo-conversation">

              {/* CHAT HEADER */}
              <header className="chattingo-chat-header">
                <button
                  type="button"
                  className="chattingo-back-button"
                  onClick={handleBackToChats}
                  title="Back to chats"
                >
                  <AiOutlineArrowLeft />
                </button>

                <img
                  src={chatImage || defaultAvatar}
                  alt="Chat profile"
                  className="chattingo-header-avatar"
                  onError={(event) => {
                    event.currentTarget.src = defaultAvatar;
                  }}
                />

                <div className="chattingo-header-info">
                  <h3>{chatName}</h3>
                  <p>
                    {currentChat?.group
                      ? `${currentChat?.users?.length || 0} members`
                      : isConnected
                        ? "Online connection"
                        : "Connecting..."}
                  </p>
                </div>

                <div className="chattingo-header-actions">
                  <button
                    type="button"
                    title="Search messages"
                    className="chattingo-icon-button"
                  >
                    <AiOutlineSearch />
                  </button>

                  <button
                    type="button"
                    title="More options"
                    className="chattingo-icon-button"
                  >
                    <BsThreeDotsVertical />
                  </button>
                </div>
              </header>

              {/* MESSAGE AREA */}
              <div
                className="chattingo-messages"
                ref={messageContainerRef}
              >
                <div className="chattingo-message-list">
                  {messages?.length > 0 ? (
                    messages.map((item, index) => (
                      <MessageCard
                        key={item.id || index}
                        isReqUserMessage={
                          item?.user?.id !== auth?.reqUser?.id
                        }
                        content={item.content}
                        timestamp={item.timestamp}
                        profilePic={
                          item?.user?.profile || defaultAvatar
                        }
                      />
                    ))
                  ) : (
                    <div className="chattingo-empty-messages">
                      <div className="chattingo-empty-icon">💬</div>
                      <h3>No messages yet</h3>
                      <p>Send a message to start the conversation.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* MESSAGE COMPOSER */}
              <footer className="chattingo-composer">

                {showEmojiPicker && (
                  <div className="chattingo-emoji-picker">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width="100%"
                      height={350}
                      lazyLoadEmojis={true}
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="chattingo-composer-icon"
                  title="Choose emoji"
                  onClick={() =>
                    setShowEmojiPicker((previous) => !previous)
                  }
                >
                  <BsEmojiSmile />
                </button>

                <textarea
                  className="chattingo-message-input"
                  placeholder="Type a message..."
                  value={content}
                  rows={1}
                  onChange={(event) => setContent(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleCreateNewMessage();
                    }
                  }}
                />

                <button
                  type="button"
                  className="chattingo-send-button"
                  title="Send message"
                  onClick={handleCreateNewMessage}
                  disabled={!content.trim()}
                >
                  <BsSendFill />
                </button>

              </footer>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
