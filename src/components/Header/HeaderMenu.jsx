import React from "react";
import KiosCard from "../Card/KiosCard";
import { FiArrowLeft } from "react-icons/fi"; // pastikan impor icon

export default function HeaderMenu({ seller }) {
  return (
    <div className="relative">
      {/* Tombol Back (hanya tablet & mobile) */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-8 left-5 lg:hidden flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20"
      >
        <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Banner */}
      <img
        src={seller.banner}
        alt="Banner"
        className="w-full h-48 object-cover"
      />

      {/* Info penjual di bawah */}
      <div className="absolute bottom-[-50px] w-full flex justify-center lg:justify-start lg:px-15 px-4">
        <div className="w-[90%] max-w-lg">
          <KiosCard
            image={seller.image}
            name={seller.name}
            description={seller.description}
            showButton={false}
          />
        </div>
      </div>
    </div>
  );
}
