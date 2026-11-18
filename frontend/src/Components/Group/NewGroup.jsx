import { Avatar, CircularProgress } from "@mui/material";
import { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ groupMember, setIsGroup, onBack }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleCreateGroup = () => {
    const trimmedName = groupName.trim();

    if (!trimmedName || isImageUploading) return;

    const userIds = Array.from(groupMember).map((user) => user.id);

    const group = {
      userIds,
      chatName: trimmedName,
      chatImage: groupImage,
    };

    dispatch(createGroupChat({ group, token }));
    setIsGroup(false);
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5 MB.");
      return;
    }

    setIsImageUploading(true);
    setUploadError("");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chattingo");
    data.append("cloud_name", "dadlxgune");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dadlxgune/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setGroupImage(result.secure_url);
    } catch (error) {
      setUploadError(error.message || "Unable to upload image.");
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-5 bg-[#008f7a] px-5 pb-5 pt-8 text-white">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-2 transition hover:bg-white/10"
          title="Back"
        >
          <BsArrowLeft className="text-2xl" />
        </button>

        <div>
          <h2 className="text-lg font-semibold">New Group</h2>
          <p className="text-xs text-white/80">
            Add a name and group photo
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-5 py-8">
        <label
          htmlFor="imgInput"
          className="group relative cursor-pointer"
          title="Choose group photo"
        >
          <Avatar
            alt="Group Image"
            src={groupImage || ""}
            sx={{
              width: 144,
              height: 144,
              bgcolor: "#e8f5f2",
              color: "#128c7e",
              fontSize: 48,
            }}
          >
            {!groupImage && "G"}
          </Avatar>

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-sm font-medium text-white transition group-hover:bg-black/40 group-hover:text-white">
            <span className="opacity-0 transition group-hover:opacity-100">
              Change photo
            </span>
          </div>

          {isImageUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <CircularProgress sx={{ color: "white" }} />
            </div>
          )}
        </label>

        <input
          type="file"
          id="imgInput"
          accept="image/*"
          className="hidden"
          disabled={isImageUploading}
          onChange={(event) => {
            uploadToCloudinary(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <p className="mt-3 text-xs text-gray-500">
          Tap to add a group photo
        </p>

        {uploadError && (
          <p className="mt-2 text-center text-xs text-red-600">
            {uploadError}
          </p>
        )}

        <div className="mt-10 w-full max-w-md">
          <label
            htmlFor="groupName"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Group Subject
          </label>

          <input
            id="groupName"
            type="text"
            maxLength={50}
            placeholder="Enter group name"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-[#f0f2f5] px-4 py-3 text-sm outline-none transition focus:border-[#128c7e] focus:bg-white"
          />

          <p className="mt-2 text-right text-xs text-gray-400">
            {groupName.length}/50
          </p>
        </div>

        <div className="mt-5 w-full max-w-md rounded-lg bg-[#f0f2f5] px-4 py-3">
          <p className="text-sm font-medium text-gray-700">
            {groupMember.size} participants selected
          </p>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || isImageUploading}
          className="flex items-center gap-2 rounded-full bg-[#128c7e] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0d766a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Group
          <BsCheck2 className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default NewGroup;
