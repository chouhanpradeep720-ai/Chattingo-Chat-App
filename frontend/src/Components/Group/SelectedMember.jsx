import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const SelectedMember = ({ handleRemoveMember, member }) => {
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=128C7E&color=fff";

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d5e9e5] bg-[#e8f5f2] py-1 pl-1 pr-2 transition hover:bg-[#dff0eb]">
      <img
        className="h-7 w-7 shrink-0 rounded-full object-cover"
        src={member?.profile || defaultAvatar}
        alt={member?.name || "Member"}
        onError={(event) => {
          event.currentTarget.src = defaultAvatar;
        }}
      />

      <span className="max-w-[120px] truncate text-xs font-medium text-gray-700">
        {member?.name || "Unknown User"}
      </span>

      <button
        type="button"
        onClick={() => handleRemoveMember(member)}
        title={`Remove ${member?.name || "member"}`}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-100 hover:text-red-600"
      >
        <AiOutlineClose className="text-xs" />
      </button>
    </div>
  );
};

export default SelectedMember;
