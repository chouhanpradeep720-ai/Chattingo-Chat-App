import React from "react";
import {
  TbCircleDashed,
  TbMessageCirclePlus,
} from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileSection = ({
  auth,
  handleNavigate,
  handleClick,
  handleCreateGroup,
  handleLogout,
  handleClose,
  open,
  anchorEl,
}) => {
  const navigate = useNavigate();

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  return (
    <div className="flex items-center justify-between bg-[#f0f2f5] px-4 py-3">
      {/* User Profile */}
      <div
        onClick={handleNavigate}
        className="flex min-w-0 cursor-pointer items-center gap-3"
      >
        <img
          className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
          src={auth?.reqUser?.profile || defaultAvatar}
          alt={auth?.reqUser?.name || "Profile"}
          onError={(event) => {
            event.currentTarget.src = defaultAvatar;
          }}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">
            {auth?.reqUser?.name || "User"}
          </p>

          <p className="text-xs text-gray-500">
            Available
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex shrink-0 items-center gap-4 text-xl text-gray-600">
        <button
          type="button"
          title="Status"
          onClick={() => navigate("/status")}
          className="rounded-full p-1 transition hover:bg-gray-200"
        >
          <TbCircleDashed />
        </button>

        <button
          type="button"
          title="New chat"
          onClick={() => navigate("/")}
          className="rounded-full p-1 transition hover:bg-gray-200"
        >
          <TbMessageCirclePlus />
        </button>

        <button
          type="button"
          title="More options"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="rounded-full p-1 transition hover:bg-gray-200"
        >
          <BsThreeDotsVertical />
        </button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleNavigate}>Profile</MenuItem>
          <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ProfileSection;
