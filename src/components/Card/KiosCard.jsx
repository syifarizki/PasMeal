import React from "react";
import { useNavigate } from "react-router-dom";

export default function KiosCard({
  image,
  name,
  description,
  showButton = true,
}) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/MenuPage"); 
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-300 flex gap-4 items-center shadow-sm transition">
      {/* Gambar */}
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
      />

      {/* Konten */}
      <div className="flex-1">
        <h4 className="font-extrabold text-base mb-1">{name.toUpperCase()}</h4>
        <p className="text-base text-black">{description}</p>

        {showButton && (
          <button
            onClick={handleNavigate}
            className="mt-3 md:mt-5 bg-primary text-sm text-white px-3 py-1 rounded-xl md:rounded-lg font-semibold transition cursor-pointer"
          >
            Lihat Menu
          </button>
        )}
      </div>
    </div>
  );
}
