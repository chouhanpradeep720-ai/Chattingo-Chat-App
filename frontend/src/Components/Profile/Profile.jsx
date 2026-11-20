import { useState } from "react";
import {
  BsArrowLeft,
  BsCheck2,
  BsPencil,
  BsCamera,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/Auth/Action";

const Profile = ({ handleCloseOpenProfile }) => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(auth?.reqUser?.name || "");
  const [tempPicture, setTempPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  const handleSaveName = () => {
    const trimmedName = username.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    dispatch(
      updateUser({
        id: auth.reqUser.id,
        token: localStorage.getItem("token"),
        data: { name: trimmedName },
      })
    );

    setUsername(trimmedName);
    setIsEditing(false);
    setError("");
  };

  const handleUpdateName = (event) => {
    if (event.key === "Enter") {
      handleSaveName();
    }
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chattingo");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/qo98nfeq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setTempPicture(result.secure_url);

      dispatch(
        updateUser({
          id: auth.reqUser.id,
          token: localStorage.getItem("token"),
          data: { profile: result.secure_url },
        })
      );
    } catch (err) {
      setError(err.message || "Unable to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center gap-8 bg-[#008069] px-6 pb-5 pt-12 text-white sm:px-10">
        <button
          type="button"
          onClick={handleCloseOpenProfile}
          className="rounded-full p-2 transition hover:bg-white/10"
          title="Back"
        >
          <BsArrowLeft className="text-2xl" />
        </button>

        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center px-5 py-10">
        <div className="group relative">
          <img
            className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md sm:h-44 sm:w-44"
            src={
              tempPicture ||
              auth?.reqUser?.profile ||
              defaultAvatar
            }
            alt="Profile"
            onError={(event) => {
              event.currentTarget.src = defaultAvatar;
            }}
          />

          <label
            htmlFor="imgInput"
            className="absolute bottom-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#008069] text-white shadow-md transition hover:bg-[#006b59]"
            title="Change profile picture"
          >
            <BsCamera className="text-xl" />
          </label>

          <input
            type="file"
            id="imgInput"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              uploadToCloudinary(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {uploading
            ? "Uploading picture..."
            : "Tap the camera icon to change your photo"}
        </p>
      </div>

      {/* Name Section */}
      <div className="mx-4 rounded-xl bg-white p-5 shadow-sm sm:mx-8">
        <p className="mb-4 text-sm font-medium text-[#008069]">
          Your name
        </p>

        {!isEditing ? (
          <div className="flex items-center justify-between gap-3">
            <p className="break-words text-base font-medium text-gray-800">
              {auth?.reqUser?.name || "Username"}
            </p>

            <button
              type="button"
              onClick={() => {
                setUsername(auth?.reqUser?.name || "");
                setIsEditing(true);
                setError("");
              }}
              title="Edit name"
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#008069]"
            >
              <BsPencil className="text-lg" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onKeyDown={handleUpdateName}
              placeholder="Enter your name"
              autoFocus
              className="w-full border-b-2 border-[#008069] bg-transparent px-2 py-2 text-sm text-gray-800 outline-none"
            />

            <button
              type="button"
              onClick={handleSaveName}
              className="w-full rounded-lg bg-[#008069] py-2.5 text-sm font-medium text-white transition hover:bg-[#006d5b]"
            >
              Save
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Information */}
      <div className="mx-4 mb-8 mt-5 rounded-xl bg-white p-5 shadow-sm sm:mx-8">
        <p className="text-sm leading-6 text-gray-500">
          This is not your username or PIN. This name will be visible to
          other people who contact you on Chattingo.
        </p>
      </div>
    </div>
  );
};

export default Profile;