import React, { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineFile,
  AiOutlinePicture,
} from "react-icons/ai";

const FilePreview = ({ file, onRemove, onSend }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type?.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);

      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreview(null);
  }, [file]);

  if (!file) return null;

  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isImage = file.type?.startsWith("image/");

  return (
    <div className="file-preview-container">
      <button
        type="button"
        className="file-preview-remove"
        onClick={onRemove}
        title="Remove attachment"
        aria-label="Remove attachment"
      >
        <AiOutlineClose />
      </button>

      {isImage && preview ? (
        <div className="file-preview-image-wrapper">
          <img
            src={preview}
            alt={file.name || "Image preview"}
            className="file-preview-image"
          />

          <div className="file-preview-image-label">
            <AiOutlinePicture />
            <span>{file.name}</span>
          </div>
        </div>
      ) : (
        <div className="file-preview-document">
          <AiOutlineFile />

          <div className="file-preview-document-info">
            <div className="file-preview-name" title={file.name}>
              {file.name}
            </div>

            <div className="file-preview-size">
              {formatFileSize(file.size)}
            </div>

            {file.type && (
              <div className="file-preview-type">
                {file.type}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="file-preview-send"
        onClick={() => onSend?.(file)}
      >
        Send attachment
      </button>
    </div>
  );
};

export default FilePreview;
