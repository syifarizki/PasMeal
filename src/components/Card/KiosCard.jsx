import React from "react";
import { useNavigate } from "react-router-dom";

export default function KiosCard({
  kiosId,
  gambar_kios,
  name,
  description,
  showButton = true,
}) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/MenuPage/${kiosId}`);
  };

  const imgSrc = gambar_kios
    ? gambar_kios.startsWith("http")
      ? gambar_kios 
      : `${import.meta.env.VITE_API_URL}/uploads/${gambar_kios}`
    : "/images/menudefault.jpg";


  return (
    <div className="bg-white p-3 rounded-lg border border-gray-300 flex gap-4 items-center shadow-sm transition hover:shadow-md">
      <img
        src={imgSrc}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/menudefault.jpg";
        }}
        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1">
        <h4 className="font-extrabold text-base mb-1">{name?.toUpperCase()}</h4>
        <p className="text-base text-black">
          {description || "Deskripsi kios belum tersedia"}
        </p>

        {showButton && (
          <button
            onClick={handleNavigate}
            className="mt-3 md:mt-5 bg-primary text-sm text-white px-3 py-1 rounded-xl md:rounded-lg font-semibold transition hover:bg-primary/80 cursor-pointer"
          >
            Lihat Menu
          </button>
        )}
      </div>
    </div>
  );
}
