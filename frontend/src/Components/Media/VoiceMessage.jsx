import React from "react";
import { AiOutlineAudio } from "react-icons/ai";

const VoiceMessage = ({
  src,
  duration,
  isOwnMessage = false,
}) => {
  if (!src) return null;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div
      className={`voice-message ${
        isOwnMessage
          ? "voice-message-sent"
          : "voice-message-received"
      }`}
    >
      <div className="voice-message-icon">
        <AiOutlineAudio />
      </div>

      <div className="voice-message-player">
        <audio
          controls
          preload="metadata"
          src={src}
        >
          Your browser does not support audio playback.
        </audio>

        {duration !== undefined && duration !== null && (
          <span className="voice-message-duration">
            {formatDuration(duration)}
          </span>
        )}
      </div>
    </div>
  );
};

export default VoiceMessage;
