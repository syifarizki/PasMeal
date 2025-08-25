import React from "react";
import { IoMdClose, IoMdInformationCircle } from "react-icons/io";

export default function Alert({ message, onClose }) {
  return (
    <div className="flex items-center justify-between bg-white text-gray-800 rounded-lg shadow-lg border border-[#005B96] p-3 mb-3 w-full max-w-xl mt-10 ">
      {/* Icon + Pesan */}
      <div className="flex items-start space-x-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
          <IoMdInformationCircle className="text-[#005B96] text-lg" />
        </div>
        <p className="text-sm leading-snug text-[#005B96]">
          <span className="font-semibold text-[#005B96]">{message.title} </span>
          {message.text}
        </p>
      </div>

      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="text-[#005B96] hover:text-gray-600 transition cursor-pointer"
      >
        <IoMdClose size={18} />
      </button>
    </div>
  );
}
