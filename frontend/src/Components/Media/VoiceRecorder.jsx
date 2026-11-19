import React, { useRef, useState, useEffect } from "react";
import {
  AiOutlineAudio,
  AiOutlineStop,
  AiOutlineClose,
} from "react-icons/ai";

const VoiceRecorder = ({
  onRecordingComplete,
  onCancel,
}) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const cancelledRef = useRef(false);

  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  // Recording timer
  useEffect(() => {
    let timer;

    if (recording) {
      timer = setInterval(() => {
        if (startTimeRef.current) {
          setDuration(
            Math.floor((Date.now() - startTimeRef.current) / 1000)
          );
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recording]);

  // Cleanup microphone if component is removed
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      cancelledRef.current = false;

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Microphone recording is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      let mimeType = "";

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        const recordingDuration = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : duration;

        stream.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
        setRecording(false);

        if (!cancelledRef.current && blob.size > 0) {
          onRecordingComplete?.(blob, recordingDuration);
        }

        chunksRef.current = [];
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setRecording(false);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      startTimeRef.current = Date.now();
      setDuration(0);

      recorder.start();
      setRecording(true);
    } catch (err) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setRecording(false);

      if (err.name === "NotAllowedError") {
        setError("Microphone permission denied. Please allow microphone access.");
      } else {
        setError("Microphone access denied or unavailable.");
      }
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setRecording(false);
  };

  const cancelRecording = () => {
    cancelledRef.current = true;

    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;
    chunksRef.current = [];

    setRecording(false);
    setDuration(0);
    setError("");

    onCancel?.();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="voice-recorder">
      {error && (
        <div className="voice-recorder-error">
          {error}
        </div>
      )}

      {!recording ? (
        <button
          type="button"
          className="voice-record-start"
          onClick={startRecording}
        >
          <AiOutlineAudio />
          <span>Start recording</span>
        </button>
      ) : (
        <div className="voice-recording-active">
          <span className="voice-recording-dot" />

          <span className="voice-recording-duration">
            {formatDuration(duration)}
          </span>

          <button
            type="button"
            onClick={stopRecording}
            title="Stop and send recording"
            aria-label="Stop recording"
          >
            <AiOutlineStop />
          </button>

          <button
            type="button"
            onClick={cancelRecording}
            title="Cancel recording"
            aria-label="Cancel recording"
          >
            <AiOutlineClose />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
