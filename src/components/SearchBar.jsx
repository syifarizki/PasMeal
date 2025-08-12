import { FaSearch } from "react-icons/fa";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center border border-gray-300 bg-white rounded-lg shadow-sm px-4 py-2 w-full">
      <FaSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder={placeholder || "Cari Menu.."}
        value={value}
        onChange={onChange}
        className="w-full outline-none text-gray-700"
      />
    </div>
  );
}
