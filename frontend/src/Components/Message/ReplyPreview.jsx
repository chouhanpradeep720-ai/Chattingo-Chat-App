import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ReplyPreview = ({ message, onCancel }) => {
  if (!message) return null;

  const sender =
    message.sender?.name ||
    message.senderName ||
    "Message";

  const content = message.content || message.message || "";

  return (
    <div className="reply-preview">
      <div className="reply-preview-content">
        <div className="reply-preview-sender">{sender}</div>
        <div className="reply-preview-text">{content}</div>
      </div>

      {onCancel && (
        <button
          type="button"
          className="reply-preview-close"
          onClick={onCancel}
          aria-label="Cancel reply"
        >
          <AiOutlineClose />
        </button>
      )}
    </div>
  );
};

export default ReplyPreview;
