'use client';
import { AiOutlineSearch } from 'react-icons/ai';

export const SearchBar = () => {
  return (
    <div className="relative">
      <AiOutlineSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-gray-100 p-2 pl-10 rounded-lg focus:outline-none border-none"
      />
    </div>
  );
};
