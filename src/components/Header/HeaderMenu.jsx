import React from "react";
import KiosCard from "../Card/KiosCard";
import { FiArrowLeft } from "react-icons/fi";

export default function HeaderMenu({ kios }) {
  if (!kios) return null;

  // Logika lebih aman untuk gambar kios
  const gambarKiosSrc =
    kios.gambar_kios && kios.gambar_kios.trim() !== ""
      ? kios.gambar_kios.startsWith("http")
        ? kios.gambar_kios
        : `${import.meta.env.VITE_API_URL}/uploads/${kios.gambar_kios}`
      : "/images/menudefault.jpg";

  const kiosName = kios?.nama_kios || "Kios";
  const kiosDesc = kios?.deskripsi || "Deskripsi kios belum tersedia";

  return (
    <div className="relative">
      {/* Tombol Back */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-8 left-5 lg:hidden flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20"
      >
        <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Banner (pakai gambar kios) */}
      <img
        src={gambarKiosSrc}
        alt="Banner"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/menudefault.jpg";
        }}
        className="w-full h-48 object-cover"
      />

      {/* Info kios */}
      <div className="absolute bottom-[-50px] w-full flex justify-center lg:justify-start lg:px-15 px-4">
        <div className="w-[90%] max-w-lg">
          <KiosCard
            kiosId={kios.id}
            gambar_kios={gambarKiosSrc}
            name={kiosName}
            description={kiosDesc}
            showButton={false}
          />
        </div>
      </div>
    </div>
  );
}
