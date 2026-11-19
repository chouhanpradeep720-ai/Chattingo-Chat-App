import React from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePushpin,
  AiOutlineSmile,
} from "react-icons/ai";
import { BsReply } from "react-icons/bs";

const MessageActions = ({
  isOwnMessage = false,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onReact,
}) => {
  return (
    <div className="message-actions">
      {/* Reply */}
      <button
        type="button"
        title="Reply"
        onClick={onReply}
      >
        <BsReply />
      </button>

      {/* React */}
      <button
        type="button"
        title="React"
        onClick={onReact}
      >
        <AiOutlineSmile />
      </button>

      {/* Pin */}
      <button
        type="button"
        title="Pin message"
        onClick={onPin}
      >
        <AiOutlinePushpin />
      </button>

      {/* Edit and Delete - only for own messages */}
      {isOwnMessage && (
        <>
          <button
            type="button"
            title="Edit message"
            onClick={onEdit}
          >
            <AiOutlineEdit />
          </button>

          <button
            type="button"
            title="Delete message"
            onClick={onDelete}
          >
            <AiOutlineDelete />
          </button>
        </>
      )}
    </div>
  );
};

export default MessageActions;