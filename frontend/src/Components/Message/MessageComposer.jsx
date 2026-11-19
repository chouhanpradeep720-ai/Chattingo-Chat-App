import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  AiOutlineSmile,
  AiOutlinePaperClip,
  AiOutlineSend,
  AiOutlineAudio,
} from "react-icons/ai";

const MessageComposer = ({
  value = "",
  onChange,
  onSend,
  onAttachment,
  onVoice,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  // Automatically adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handleChange = (e) => {
    onChange?.(e.target.value);
    onTyping?.();
  };

  const handleEmojiClick = (emojiData) => {
    onChange?.(value + emojiData.emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const handleSend = (e) => {
    e?.preventDefault();

    if (!value.trim() || disabled) return;

    onSend?.();
    setShowEmoji(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-composer">
      {showEmoji && (
        <div className="composer-emoji-picker">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={320}
            height={400}
          />
        </div>
      )}

      <button
        type="button"
        className="composer-icon-button"
        title="Emoji"
        onClick={() => setShowEmoji((prev) => !prev)}
        disabled={disabled}
      >
        <AiOutlineSmile />
      </button>

      <button
        type="button"
        className="composer-icon-button"
        title="Attach photo or document"
        onClick={() => {
          setShowEmoji(false);
          onAttachment?.();
        }}
        disabled={disabled}
      >
        <AiOutlinePaperClip />
      </button>

      <textarea
        ref={textareaRef}
        className="composer-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        maxLength={10000}
      />

      {value.trim() ? (
        <button
          type="button"
          className="composer-send-button"
          title="Send message"
          onClick={handleSend}
          disabled={disabled}
        >
          <AiOutlineSend />
        </button>
      ) : (
        <button
          type="button"
          className="composer-voice-button"
          title="Voice message"
          onClick={() => {
            setShowEmoji(false);
            onVoice?.();
          }}
          disabled={disabled}
        >
          <AiOutlineAudio />
        </button>
      )}
    </div>
  );
};

export default MessageComposer;
