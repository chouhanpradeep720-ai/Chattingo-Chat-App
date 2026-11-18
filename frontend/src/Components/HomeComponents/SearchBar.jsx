import React from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const SearchBar = ({ querys, setQuerys, handleSearch }) => {
  const handleClear = () => {
    setQuerys("");
    handleSearch("");
  };

  return (
    <div className="w-full bg-white px-4 py-3">
      <div className="relative flex items-center w-full">
        <AiOutlineSearch className="absolute left-4 text-gray-500 text-lg pointer-events-none" />

        <input
          type="text"
          value={querys}
          placeholder="Search or start a new chat"
          onChange={(event) => {
            setQuerys(event.target.value);
            handleSearch(event.target.value);
          }}
          className="w-full rounded-lg border border-transparent bg-[#f0f2f5] py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-500 focus:border-[#128c7e] focus:bg-white"
        />

        {querys && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            className="absolute right-4 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <AiOutlineClose className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
