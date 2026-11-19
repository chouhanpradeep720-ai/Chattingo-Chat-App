import React, { useRef } from "react";
import {
  AiOutlinePicture,
  AiOutlineFile,
  AiOutlineCamera,
} from "react-icons/ai";

const AttachmentMenu = ({ onFileSelect, onClose }) => {
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const cameraRef = useRef(null);

  const selectFile = (ref) => {
    ref.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      onFileSelect?.(file);
      onClose?.();
    }

    // Allows selecting the same file again
    e.target.value = "";
  };

  return (
    <div className="attachment-menu">
      {/* Any file */}
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={handleChange}
      />

      {/* Photos and images */}
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      {/* Camera */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleChange}
      />

      <button
        type="button"
        className="attachment-menu-item"
        onClick={() => selectFile(imageRef)}
      >
        <AiOutlinePicture />
        <span>Photos</span>
      </button>

      <button
        type="button"
        className="attachment-menu-item"
        onClick={() => selectFile(fileRef)}
      >
        <AiOutlineFile />
        <span>Document</span>
      </button>

      <button
        type="button"
        className="attachment-menu-item"
        onClick={() => selectFile(cameraRef)}
      >
        <AiOutlineCamera />
        <span>Camera</span>
      </button>
    </div>
  );
};

export default AttachmentMenu;
