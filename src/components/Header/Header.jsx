import React from "react";

export default function Header() {
  return (
    <div
      className="relative text-white px-4 md:px-6 pb-16 md:pb-24 pt-8 md:pt-10"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: "400px auto",
        backgroundRepeat: "repeat",
        backgroundPosition: "top center",
      }}
    >
      <div className="relative z-10">
        {/* Baris Atas */}
        <div className="flex justify-between items-start relative">
          {/* Teks Judul */}
          <div className="mt-4">
            <div className="flex items-center rounded-full border-2 md:border-4 border-white overflow-hidden min-w-[220px] md:min-w-[280px] lg:min-w-[340px]">
              <span className="bg-white text-black font-extrabold text-sm md:text-lg lg:text-2xl px-4 md:px-2 py-1">
                SELAMAT DATANG DI
              </span>
            </div>
            <h1 className="font-extrabold ml-3 mt-3 text-3xl md:text-5xl lg:text-6xl">
              PASMEAL!
            </h1>
          </div>

          {/* Gambar Koki */}
          <div className="absolute top-[-10px] right-[-5px] md:top-[-30px] md:right-[50px] lg:top-[-10px] lg:right-[80px]">
            <img
              src="/images/koki.png"
              alt="Logo Koki"
              className="w-25 md:w-56 lg:w-72 xl:w-80 h-auto object-contain"
            />
          </div>
        </div>

        {/* Deskripsi Tengah */}
        <div className="flex justify-center">
          <p className="mt-3 text-center max-w-md text-sm md:text-xl lg:text-2xl font-medium">
            Lihat berbagai pilihan makanan dan minuman dari kios favorit di
            kampusmu!
          </p>
        </div>
      </div>
    </div>
  );
}
