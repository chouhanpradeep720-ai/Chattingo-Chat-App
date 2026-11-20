import React, { useState } from "react";
import MessageActions from "../Message/MessageActions";
import MessageReactions from "../Message/MessageReactions";
import VoiceMessage from "../Media/VoiceMessage";
import { BASE_API_URL } from "../../config/api";

const MessageCard = ({
  isReqUserMessage,
  content,
  timestamp,
  profilePic,

  message,
  messageId,
  replyTo,
  reactions = [],
  status,
  edited = false,
  isPinned = false,

  onReply,
  onEdit,
  onDelete,
  onPin,
  onReact,
}) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content || "");
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  const handleEditSave = () => {
    if (!editContent.trim()) return;

    onEdit?.(message || messageId, editContent.trim());
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(content || "");
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(message || messageId);
  };

  const handlePin = () => {
    onPin?.(message || messageId);
  };

  const handleReply = () => {
    onReply?.(
      message || {
        id: messageId,
        content,
        timestamp,
      }
    );
  };

  const handleReaction = (emoji) => {
    onReact?.(message || messageId, emoji);
    setShowReactionPicker(false);
  };

  const renderStatus = () => {
    if (isReqUserMessage) return null;

    if (status === "read") {
      return (
        <span className="message-status message-status-read" title="Read">
          ✓✓
        </span>
      );
    }

    if (status === "delivered") {
      return (
        <span className="message-status" title="Delivered">
          ✓✓
        </span>
      );
    }

    return (
      <span className="message-status" title="Sent">
        ✓
      </span>
    );
  };

  // Resolve media URLs against the backend
  const getMediaUrl = (url) => {
    if (!url) return "";

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `${BASE_API_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  // Media rendering
  const renderMedia = () => {
    if (!message?.mediaUrl) return null;

    const mediaUrl = getMediaUrl(message.mediaUrl);
    const mediaType = (message.mediaType || "").toLowerCase();
    const isVoice = message.voiceMessage || message.isVoiceMessage;
    const fileName = message.fileName || "Shared file";

    if (mediaType === "image") {
      return (
        <div className="message-media-wrapper">
          <a href={mediaUrl} target="_blank" rel="noreferrer">
            <img
              src={mediaUrl}
              alt={fileName}
              className="message-shared-image"
              loading="lazy"
            />
          </a>

          {message.fileName && (
            <p className="message-media-filename">{fileName}</p>
          )}
        </div>
      );
    }

    if (mediaType === "video") {
      return (
        <div className="message-media-wrapper">
          <video
            src={mediaUrl}
            controls
            preload="metadata"
            className="message-shared-video"
          />

          {message.fileName && (
            <p className="message-media-filename">{fileName}</p>
          )}
        </div>
      );
    }

    if (mediaType === "audio" || isVoice) {
      return (
        <div className="message-media-wrapper">
          <VoiceMessage
            src={mediaUrl}
            duration={message.voiceDuration}
            isOwnMessage={!isReqUserMessage}
          />

          {!isVoice && message.fileName && (
            <p className="message-media-filename">{fileName}</p>
          )}
        </div>
      );
    }

    // Documents and other files
    return (
      <div className="message-shared-file">
        <div className="message-file-icon">📄</div>

        <div className="message-file-details">
          <p className="message-file-name">
            {fileName}
          </p>

          <span className="message-file-size">
            {formatFileSize(message.fileSize)}
          </span>
        </div>

        <a
          href={mediaUrl}
          target="_blank"
          rel="noreferrer"
          download={fileName}
          className="message-file-download"
          title="Download file"
        >
          ⬇
        </a>
      </div>
    );
  };

  return (
    <div
      className={`flex w-full items-end gap-2 px-1 mb-3 group ${isReqUserMessage ? "justify-start" : "justify-end"
        }`}
      data-message-id={messageId || message?.id || ""}
    >
      {/* Incoming avatar */}
      {isReqUserMessage && (
        <img
          src={profilePic || defaultAvatar}
          alt="User profile"
          onError={(event) => {
            event.currentTarget.src = defaultAvatar;
          }}
          className="h-8 w-8 shrink-0 rounded-full object-cover mb-1 shadow-sm"
        />
      )}

      {/* Message column */}
      <div className="message-card-column min-w-0 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%]">
        {/* Actions */}
        {!editing && (
          <div className="message-card-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <MessageActions
              isOwnMessage={!isReqUserMessage}
              onReply={handleReply}
              onReact={() =>
                setShowReactionPicker((previous) => !previous)
              }
              onEdit={() => {
                setEditContent(content || "");
                setEditing(true);
              }}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative min-w-0 px-3.5 py-2.5 shadow-sm transition-all duration-200 group-hover:shadow-md ${isReqUserMessage
              ? "bg-white text-[#303030] rounded-2xl rounded-bl-[5px] border border-gray-100"
              : "bg-[#d9fdd3] text-[#303030] rounded-2xl rounded-br-[5px]"
            }`}
        >
          {/* Pin indicator */}
          {isPinned && (
            <div className="message-pinned-label">
              📌 Pinned
            </div>
          )}

          {/* Reply context */}
          {replyTo && (
            <div className="message-reply-context">
              <div className="message-reply-context-sender">
                {replyTo.sender?.name ||
                  replyTo.senderName ||
                  replyTo.user?.name ||
                  "Message"}
              </div>

              <div className="message-reply-context-content">
                {replyTo.content || "Message"}
              </div>
            </div>
          )}

          {/* Edit mode */}
          {editing ? (
            <div className="message-edit-container">
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                autoFocus
                rows={2}
                className="message-edit-textarea"
              />

              <div className="message-edit-buttons">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="message-edit-cancel"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={!editContent.trim()}
                  className="message-edit-save"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Media */}
              {renderMedia()}

              {/* Text */}
              {content &&
                !message?.voiceMessage &&
                !message?.isVoiceMessage &&
                !message?.mediaUrl && (
                  <p className="text-[14px] leading-[1.55] whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {content}
                  </p>
                )}
            </>
          )}

          {/* Timestamp */}
          {!editing && (
            <div className="flex items-center justify-end gap-1 mt-1.5">
              {edited && (
                <span className="message-edited-label">
                  edited
                </span>
              )}

              <span className="text-[10px] tracking-wide text-gray-500">
                {formatTime(timestamp)}
              </span>

              {renderStatus()}
            </div>
          )}
        </div>

        {/* Reactions */}
        {!editing && (
          <MessageReactions
            reactions={reactions}
            onReact={handleReaction}
            showPicker={showReactionPicker}
            onTogglePicker={() =>
              setShowReactionPicker((previous) => !previous)
            }
          />
        )}
      </div>
    </div>
  );
};

export default MessageCard;