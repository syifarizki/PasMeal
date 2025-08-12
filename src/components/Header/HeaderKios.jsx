import React from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function HeaderKios() {
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
      <div className="flex items-start justify-start gap-3">
        <button
          onClick={() => window.history.back()}
          className="lg:hidden flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20 -mt-3"
        >
          <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6 " />
        </button>

        <div className="flex flex-col ml-4">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-left -mt-4">
            Kumpulan Kios-Kios
          </h1>
          <p className="mt-1 md:mt-2 text-sm md:text-xl lg:text-2xl font-medium text-left text-white">
            Temukan kios makanan dan minuman favoritmu
          </p>
        </div>
      </div>
    </div>
  );
}
