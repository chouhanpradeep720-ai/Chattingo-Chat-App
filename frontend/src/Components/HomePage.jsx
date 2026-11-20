import React, { useCallback, useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages, uploadMedia } from "../Redux/Message/Action";
import SockJs from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

import Profile from "./Profile/Profile";
import CreateGroup from "./Group/CreateGroup";
import ProfileSection from "./HomeComponents/ProfileSection";
import SearchBar from "./HomeComponents/SearchBar";
import ChatList from "./HomeComponents/ChatList";
import MessageCard from "./MessageCard/MessageCard";

import ReplyPreview from "./Message/ReplyPreview";
import MessageSearch from "./Message/MessageSearch";
import PinnedMessages from "./Message/PinnedMessages";
import MessageComposer from "./Message/MessageComposer";

import AttachmentMenu from "./Media/AttachmentMenu";
import FilePreview from "./Media/FilePreview";
import VoiceRecorder from "./Media/VoiceRecorder";

import TypingIndicator from "./Chat/TypingIndicator";
import PresenceBadge from "./Chat/PresenceBadge";
import LastSeen from "./Chat/LastSeen";

import "./ChattingoFeatures.css";

import {
  AiOutlineSearch,
  AiOutlineArrowLeft,
} from "react-icons/ai";

import { BsThreeDotsVertical } from "react-icons/bs";

import { BASE_API_URL } from "../config/api";

function HomePage() {
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Message features
  const [replyTo, setReplyTo] = useState(null);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  // Presence and typing placeholders (backend integration pending)
  const [otherUserOnline, setOtherUserOnline] = useState(null);
  const [otherUserLastSeen, setOtherUserLastSeen] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  // Media states
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");

  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const messageContainerRef = useRef(null);
  const stompClientRef = useRef(null);
  const currentChatRef = useRef(currentChat);
  currentChatRef.current = currentChat;
  const creatingChatRef = useRef(false);
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  // Scroll to latest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset presence and typing states when chat changes
  useEffect(() => {
    setOtherUserOnline(null);
    setOtherUserLastSeen(null);
    setTypingUsers([]);
  }, [currentChat?.id]);

  // WebSocket connection
  const connect = useCallback(() => {
    if (!token) return;

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
      return null;
    };

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
  }, [token]);

  // Receive WebSocket messages
  const onMessageReceive = useCallback((payload) => {
    try {
      const receivedMessage = JSON.parse(payload.body);

      setMessages((previousMessages) => {
        const activeChatId = currentChatRef.current?.id;
        const receivedChatId = receivedMessage.chat?.id;

        // Ignore messages not belonging to the currently open chat
        if (
          !activeChatId ||
          !receivedChatId ||
          String(activeChatId) !== String(receivedChatId)
        ) {
          return previousMessages;
        }

        // Only deduplicate messages that have a valid ID
        const alreadyExists = receivedMessage.id != null &&
          previousMessages.some(
            (msg) =>
              msg.id != null &&
              String(msg.id) === String(receivedMessage.id)
          );

        if (alreadyExists) {
          return previousMessages.map((msg) =>
            String(msg.id) === String(receivedMessage.id)
              ? { ...msg, ...receivedMessage }
              : msg
          );
        }

        return [...previousMessages, receivedMessage].sort(
          (a, b) =>
            new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
        );
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
  }, []);

  // Connect WebSocket
  useEffect(() => {
    connect();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [connect]);

  // Subscribe to selected chat
  useEffect(() => {
    if (!isConnected || !stompClient || !currentChat?.id) return;

    const subscription = stompClient.subscribe(
      `/topic/chat/${currentChat.id}`,
      onMessageReceive
    );

    return () => subscription.unsubscribe();
  }, [isConnected, stompClient, currentChat?.id, onMessageReceive]);

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

  // Sync messages from Redux
  // Sync Redux messages without losing local messages
  useEffect(() => {
    if (!Array.isArray(message.messages) || !currentChat?.id) return;

    const chatId = currentChat.id;

    const serverMessages = message.messages.filter(
      (msg) => String(msg.chat?.id) === String(chatId)
    );

    setMessages((previousMessages) => {
      const localMessages = previousMessages.filter(
        (msg) =>
          String(msg.chat?.id) === String(chatId) &&
          msg.localOnly
      );

      const mergedMessages = [...serverMessages];

      localMessages.forEach((localMessage) => {
        const alreadyExists = mergedMessages.some(
          (msg) => String(msg.id) === String(localMessage.id)
        );

        if (!alreadyExists) {
          mergedMessages.push(localMessage);
        }
      });

      return mergedMessages.sort(
        (a, b) =>
          new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
      );
    });
  }, [message.messages, currentChat?.id]);

  // Load pinned messages
  useEffect(() => {
    if (!currentChat?.id) {
      setPinnedMessages([]);
      setReplyTo(null);
      setShowMessageSearch(false);
      return;
    }

    const storageKey = `chattingo-pinned-${currentChat.id}`;

    try {
      const storedPins = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setPinnedMessages(Array.isArray(storedPins) ? storedPins : []);
    } catch {
      setPinnedMessages([]);
    }

    setReplyTo(null);
    setShowMessageSearch(false);
    setSelectedFile(null);
    setShowAttachmentMenu(false);
    setShowVoiceRecorder(false);
  }, [currentChat?.id]);

  // Fetch chats
  useEffect(() => {
    if (token) {
      dispatch(getUsersChat({ token }));
    }
  }, [token, chat.createdChat, chat.createdGroup, dispatch]);

  // Open newly created chat
  useEffect(() => {
    if (chat.createdChat?.id) {
      setCurrentChat(chat.createdChat);
      setQuerys("");
    }
  }, [chat.createdChat]);

  // Fetch current user
  useEffect(() => {
    if (token) dispatch(currentUser(token));
  }, [token, dispatch]);

  // User menu
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Select chat
  const handleCurrentChat = (item) => {
    setCurrentChat(item);
    setReplyTo(null);
    setShowMessageSearch(false);
    setShowAttachmentMenu(false);
    setSelectedFile(null);
    setShowVoiceRecorder(false);
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

  // Create chat
  // Create or open single chat
  const handleClickOnChatCard = async (userId) => {
    if (!userId || creatingChatRef.current) return;

    creatingChatRef.current = true;

    try {
      const createdChat = await dispatch(
        createChat({
          token,
          data: { userId },
        })
      );

      if (createdChat?.id) {
        setCurrentChat(createdChat);
        setQuerys("");
        setReplyTo(null);
        setShowMessageSearch(false);
        setShowAttachmentMenu(false);
        setSelectedFile(null);
        setShowVoiceRecorder(false);
      }
    } finally {
      creatingChatRef.current = false;
    }
  };

  // Send normal text message
  const handleCreateNewMessage = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || !currentChat?.id) return;

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
    setReplyTo(null);
  };

  // Add successfully created server message to UI without duplicates
  const addServerMessageToState = (savedMessage) => {
    if (!savedMessage?.id) return;

    setMessages((previousMessages) => {
      const exists = previousMessages.some(
        (msg) => String(msg.id) === String(savedMessage.id)
      );

      if (exists) {
        return previousMessages.map((msg) =>
          String(msg.id) === String(savedMessage.id)
            ? { ...msg, ...savedMessage }
            : msg
        );
      }

      if (
        String(savedMessage.chat?.id) !==
        String(currentChatRef.current?.id)
      ) {
        return previousMessages;
      }

      return [...previousMessages, savedMessage].sort(
        (a, b) =>
          new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
      );
    });

    if (savedMessage.chat?.id) {
      setLastMessages((previous) => ({
        ...previous,
        [savedMessage.chat.id]: savedMessage,
      }));
    }
  };

  // Select attachment
  const handleFileSelect = (file) => {
    if (!file) return;

    setSelectedFile(file);
    setShowAttachmentMenu(false);
  };

  // Upload attachment and create persistent message
  const handleSendAttachment = async (file) => {
    if (!file || !currentChat?.id) return;

    const chatId = currentChat.id;

    let mediaType = "document";

    if (file.type.startsWith("image/")) {
      mediaType = "image";
    } else if (file.type.startsWith("video/")) {
      mediaType = "video";
    } else if (file.type.startsWith("audio/")) {
      mediaType = "audio";
    }

    try {
      // Upload file to backend
      const uploadResult = await uploadMedia(file, token);

      if (!uploadResult?.fileUrl) {
        alert("File upload failed. Please try again.");
        return;
      }

      // Save message metadata in database
      const savedMessage = await dispatch(
        createMessage({
          token,
          data: {
            chatId,
            content: file.name,
            mediaUrl: uploadResult.fileUrl,
            mediaType,
            fileName: file.name,
            fileSize: file.size,
            voiceMessage: false,
          },
        })
      );

      if (!savedMessage) {
        alert("File uploaded, but message could not be saved.");
        return;
      }

      // Preserve reply context locally (reply persistence is not implemented yet)
      const messageWithReply = {
        ...savedMessage,
        replyTo: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              sender: replyTo.sender || replyTo.user,
            }
          : null,
      };

      addServerMessageToState(messageWithReply);

      setSelectedFile(null);
      setReplyTo(null);
    } catch (error) {
      console.error("Attachment sending error:", error);
      alert(error.message || "Unable to send attachment.");
    }
  };

  // Start voice recorder
  const handleStartVoice = () => {
    setShowVoiceRecorder(true);
    setShowAttachmentMenu(false);
  };

  // Upload voice recording and create persistent voice message
  const handleVoiceRecordingComplete = async (blob, duration) => {
    if (!blob || !currentChat?.id) {
      setShowVoiceRecorder(false);
      return;
    }

    const chatId = currentChat.id;

    try {
      const mimeType = blob.type || "audio/webm";
      const extension = mimeType.includes("ogg")
        ? "ogg"
        : mimeType.includes("mp4")
        ? "m4a"
        : "webm";

      const voiceFile = new File(
        [blob],
        `voice-message-${Date.now()}.${extension}`,
        { type: mimeType }
      );

      // Upload voice recording
      const uploadResult = await uploadMedia(voiceFile, token);

      if (!uploadResult?.fileUrl) {
        alert("Voice upload failed. Please try again.");
        setShowVoiceRecorder(false);
        return;
      }

      // Save voice message in database
      const savedMessage = await dispatch(
        createMessage({
          token,
          data: {
            chatId,
            content: "Voice message",
            mediaUrl: uploadResult.fileUrl,
            mediaType: "audio",
            fileName: voiceFile.name,
            fileSize: voiceFile.size,
            voiceMessage: true,
            voiceDuration: duration,
          },
        })
      );

      if (!savedMessage) {
        alert("Voice uploaded, but message could not be saved.");
        setShowVoiceRecorder(false);
        return;
      }

      const messageWithVoiceMetadata = {
        ...savedMessage,
        isVoiceMessage: true,
        voiceDuration: duration,
        replyTo: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              sender: replyTo.sender || replyTo.user,
            }
          : null,
      };

      addServerMessageToState(messageWithVoiceMetadata);

      setReplyTo(null);
      setShowVoiceRecorder(false);
    } catch (error) {
      console.error("Voice message sending error:", error);
      alert(error.message || "Unable to send voice message.");
      setShowVoiceRecorder(false);
    }
  };

  // Reply
  const handleReplyMessage = (selectedMessage) => {
    setReplyTo(selectedMessage);
  };

  const handleCancelReply = () => setReplyTo(null);

  // Edit (local state only)
  const handleEditMessage = (selectedMessage, updatedContent) => {
    const selectedId =
      typeof selectedMessage === "object"
        ? selectedMessage?.id
        : selectedMessage;

    if (!selectedId || !updatedContent?.trim()) return;

    setMessages((previous) =>
      previous.map((msg) =>
        msg.id === selectedId
          ? { ...msg, content: updatedContent.trim(), edited: true }
          : msg
      )
    );
  };

  // Delete
  const handleDeleteMessage = (selectedMessage) => {
    const selectedId =
      typeof selectedMessage === "object"
        ? selectedMessage?.id
        : selectedMessage;

    if (!selectedId) return;

    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    setMessages((previous) =>
      previous.filter((msg) => msg.id !== selectedId)
    );

    setPinnedMessages((previousPins) => {
      const updatedPins = previousPins.filter(
        (msg) => msg.id !== selectedId
      );

      if (currentChat?.id) {
        localStorage.setItem(
          `chattingo-pinned-${currentChat.id}`,
          JSON.stringify(updatedPins)
        );
      }

      return updatedPins;
    });
  };

  // Pin/unpin
  const handlePinMessage = (selectedMessage) => {
    const selectedId =
      typeof selectedMessage === "object"
        ? selectedMessage?.id
        : selectedMessage;

    if (!selectedId || !currentChat?.id) return;

    const targetMessage = messages.find(
      (msg) => msg.id === selectedId
    );

    if (!targetMessage) return;

    setPinnedMessages((previousPins) => {
      const alreadyPinned = previousPins.some(
        (msg) => msg.id === selectedId
      );

      const updatedPins = alreadyPinned
        ? previousPins.filter((msg) => msg.id !== selectedId)
        : [...previousPins, targetMessage];

      localStorage.setItem(
        `chattingo-pinned-${currentChat.id}`,
        JSON.stringify(updatedPins)
      );

      return updatedPins;
    });

    setMessages((previous) =>
      previous.map((msg) =>
        msg.id === selectedId
          ? { ...msg, isPinned: !msg.isPinned }
          : msg
      )
    );
  };

  const handleUnpinMessage = (selectedMessage) => {
    handlePinMessage(selectedMessage);
  };

  // Reactions
  const handleReactMessage = (selectedMessage, emoji) => {
    const selectedId =
      typeof selectedMessage === "object"
        ? selectedMessage?.id
        : selectedMessage;

    if (!selectedId || !emoji) return;

    setMessages((previous) =>
      previous.map((msg) => {
        if (msg.id !== selectedId) return msg;

        const reactions = Array.isArray(msg.reactions)
          ? [...msg.reactions]
          : [];

        const reactionIndex = reactions.findIndex(
          (reaction) => reaction.emoji === emoji
        );

        if (reactionIndex >= 0) {
          const reaction = reactions[reactionIndex];

          if (reaction.reactedByMe) {
            if (reaction.count <= 1) {
              reactions.splice(reactionIndex, 1);
            } else {
              reactions[reactionIndex] = {
                ...reaction,
                count: reaction.count - 1,
                reactedByMe: false,
              };
            }
          } else {
            reactions[reactionIndex] = {
              ...reaction,
              count: (reaction.count || 0) + 1,
              reactedByMe: true,
            };
          }
        } else {
          reactions.push({
            emoji,
            count: 1,
            reactedByMe: true,
          });
        }

        return { ...msg, reactions };
      })
    );
  };

  // Search toggle
  const handleToggleMessageSearch = () => {
    setShowMessageSearch((previous) => !previous);
  };

  // Scroll to message
  const handleScrollToMessage = (selectedMessage) => {
    const selectedId =
      typeof selectedMessage === "object"
        ? selectedMessage?.id
        : selectedMessage;

    if (!selectedId || !messageContainerRef.current) return;

    const elements =
      messageContainerRef.current.querySelectorAll("[data-message-id]");

    const target = Array.from(elements).find(
      (element) =>
        element.getAttribute("data-message-id") === String(selectedId)
    );

    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Profile
  const handleNavigate = () => {
    setIsProfile(true);
    setIsGroup(false);
    setAnchorEl(null);
  };

  const handleCloseOpenProfile = () => setIsProfile(false);

  // Create group
  const handleCreateGroup = () => {
    setIsGroup(true);
    setIsProfile(false);
    setAnchorEl(null);
  };

  // Back
  const handleBackToChats = () => {
    setCurrentChat(null);
    setReplyTo(null);
    setShowMessageSearch(false);
    setSelectedFile(null);
    setShowAttachmentMenu(false);
    setShowVoiceRecorder(false);
  };

  // Logout
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setIsConnected(false);
    setStompClient(null);
    dispatch(logoutAction());
    navigate("/signin");
  };

  // Authentication
  useEffect(() => {
    if (!token) navigate("/signin");
  }, [token, navigate]);

  // Chat participant
  const otherUser = currentChat?.users?.find(
    (user) => user?.id !== auth?.reqUser?.id
  );

  const chatName = currentChat?.group
    ? currentChat?.chatName || "Group Chat"
    : otherUser?.name || "Chat";

  const chatImage = currentChat?.group
    ? currentChat?.chat_image
    : otherUser?.profile;

  return (
    <div className="chattingo-page">
      <div className="chattingo-top-bar"></div>

      <div className="chattingo-container">
        {/* LEFT SIDEBAR */}
        <aside
          className={`chattingo-sidebar ${currentChat?.id ? "mobile-hide-sidebar" : ""
            }`}
        >
          {isProfile && (
            <div className="h-full w-full">
              <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
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
          className={`chattingo-main ${currentChat?.id ? "mobile-show-chat" : ""
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
              {/* HEADER */}
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

                  {currentChat?.group ? (
                    <p>{currentChat?.users?.length || 0} members</p>
                  ) : (
                    <p className="chattingo-presence-info">
                      <PresenceBadge online={otherUserOnline} />
                      <LastSeen
                        online={otherUserOnline}
                        lastSeen={otherUserLastSeen}
                      />
                    </p>
                  )}
                </div>

                <div className="chattingo-header-actions">
                  <button
                    type="button"
                    title="Search messages"
                    className={`chattingo-icon-button ${showMessageSearch ? "active" : ""
                      }`}
                    onClick={handleToggleMessageSearch}
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

              {/* SEARCH */}
              {showMessageSearch && (
                <MessageSearch
                  messages={messages}
                  onMessageClick={handleScrollToMessage}
                  onClose={() => setShowMessageSearch(false)}
                />
              )}

              {/* PINS */}
              <PinnedMessages
                messages={pinnedMessages}
                onUnpin={handleUnpinMessage}
                onMessageClick={handleScrollToMessage}
              />

              {/* MESSAGES */}
              <div
                className="chattingo-messages"
                ref={messageContainerRef}
              >
                <div className="chattingo-message-list">
                  {messages?.length > 0 ? (
                    messages.map((item, index) => (
                      <MessageCard
                        key={item.id || index}
                        message={item}
                        messageId={item.id}
                        isReqUserMessage={
                          item?.user?.id !== auth?.reqUser?.id
                        }
                        content={item.content}
                        timestamp={item.timestamp}
                        profilePic={item?.user?.profile || defaultAvatar}
                        replyTo={item.replyTo || item.repliedMessage}
                        reactions={item.reactions || []}
                        status={item.status}
                        edited={item.edited}
                        isPinned={
                          item.isPinned ||
                          pinnedMessages.some((pin) => pin.id === item.id)
                        }
                        onReply={handleReplyMessage}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        onPin={handlePinMessage}
                        onReact={handleReactMessage}
                      />
                    ))
                  ) : (
                    <div className="chattingo-empty-messages">
                      <div className="chattingo-empty-icon">💬</div>
                      <h3>No messages yet</h3>
                      <p>Send a message to start the conversation.</p>
                    </div>
                  )}

                  <TypingIndicator
                    users={typingUsers}
                    isTyping={typingUsers.length > 0}
                  />
                </div>
              </div>

              {/* COMPOSER AREA */}
              <footer className="chattingo-composer chattingo-composer-wrapper">
                {replyTo && (
                  <ReplyPreview
                    message={replyTo}
                    onCancel={handleCancelReply}
                  />
                )}

                {/* Attachment selection panel */}
                {showAttachmentMenu && (
                  <AttachmentMenu
                    onFileSelect={handleFileSelect}
                    onClose={() => setShowAttachmentMenu(false)}
                  />
                )}

                {/* File preview before sending */}
                {selectedFile && (
                  <FilePreview
                    file={selectedFile}
                    onRemove={() => setSelectedFile(null)}
                    onSend={handleSendAttachment}
                  />
                )}

                {/* Voice recorder */}
                {showVoiceRecorder ? (
                  <VoiceRecorder
                    onRecordingComplete={handleVoiceRecordingComplete}
                    onCancel={() => setShowVoiceRecorder(false)}
                  />
                ) : (
                  <MessageComposer
                    value={content}
                    onChange={setContent}
                    onSend={handleCreateNewMessage}
                    onAttachment={() =>
                      setShowAttachmentMenu((previous) => !previous)
                    }
                    onVoice={handleStartVoice}
                    onTyping={() => {
                      // Typing event will be connected to backend WebSocket later.
                    }}
                    disabled={!currentChat?.id}
                    placeholder={
                      replyTo ? "Reply to message..." : "Type a message..."
                    }
                  />
                )}
              </footer>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;