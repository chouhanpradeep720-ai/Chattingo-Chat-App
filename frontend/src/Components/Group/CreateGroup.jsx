import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false);
  const [groupMember, setGroupMember] = useState(new Set());
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const token = localStorage.getItem("token");

  const searchUsers = Array.isArray(auth?.searchUser)
    ? auth.searchUser
    : [];

  const handleRemoveMember = (item) => {
    const updatedMembers = new Set(groupMember);
    updatedMembers.delete(item);
    setGroupMember(updatedMembers);
  };

  const handleSearch = (keyword) => {
    setQuery(keyword);
    dispatch(searchUser({ keyword, token }));
  };

  const handleAddMember = (item) => {
    const updatedMembers = new Set(groupMember);
    updatedMembers.add(item);
    setGroupMember(updatedMembers);
    setQuery("");
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {!newGroup ? (
        <>
          <div className="flex items-center gap-5 bg-[#008f7a] px-5 pb-5 pt-8 text-white">
            <button
              type="button"
              onClick={() => setIsGroup(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              title="Back"
            >
              <BsArrowLeft className="text-2xl" />
            </button>

            <div>
              <h2 className="text-lg font-semibold">
                Add Participants
              </h2>
              <p className="text-xs text-white/80">
                Select people for your group
              </p>
            </div>
          </div>

          <div className="border-b border-gray-100 bg-white px-4 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Selected Members ({groupMember.size})
            </p>

            <div className="flex flex-wrap gap-2">
              {Array.from(groupMember).map((item) => (
                <SelectedMember
                  key={item.id}
                  handleRemoveMember={handleRemoveMember}
                  member={item}
                />
              ))}
            </div>

            <div className="relative mt-4">
              <AiOutlineSearch className="absolute left-3 top-3 text-lg text-gray-500" />

              <input
                type="text"
                value={query}
                placeholder="Search people by name"
                onChange={(event) => handleSearch(event.target.value)}
                className="w-full rounded-lg bg-[#f0f2f5] py-3 pl-10 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-[#128c7e]"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                  title="Clear search"
                >
                  <AiOutlineClose />
                </button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {query ? (
              searchUsers.length > 0 ? (
                searchUsers.map((item) => {
                  const alreadySelected = Array.from(groupMember).some(
                    (member) => member.id === item.id
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!alreadySelected) {
                          handleAddMember(item);
                        }
                      }}
                      className={`cursor-pointer border-b border-gray-100 ${alreadySelected
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <ChatCard
                        userImg={item.profile}
                        name={item.name}
                        lastMessage={{
                          content: alreadySelected
                            ? "Already selected"
                            : "Tap to add participant",
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="py-10 text-center text-sm text-gray-500">
                  No users found
                </p>
              )
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-500">
                  Search for people to add to your group.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">
              {groupMember.size} member(s) selected
            </p>

            <button
              type="button"
              disabled={groupMember.size === 0}
              onClick={() => setNewGroup(true)}
              className="flex items-center gap-2 rounded-full bg-[#128c7e] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0d766a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <BsArrowRight className="text-lg" />
            </button>
          </div>
        </>
      ) : (
        <NewGroup
          groupMember={groupMember}
          setIsGroup={setIsGroup}
          onBack={() => setNewGroup(false)}
        />
      )}
    </div>
  );
};

export default CreateGroup;
