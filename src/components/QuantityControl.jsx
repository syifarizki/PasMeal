import { FaMinus, FaPlus } from "react-icons/fa6";

export default function QuantityControl({ qty, setQty }) {
  return (
    <div className="flex items-center gap-3 font-semibold select-none">
      {/* Tombol Minus */}
      <button
        onClick={() => setQty(Math.max(qty - 1, 0))}
        className={`border border-primary rounded-full w-7 h-7 flex items-center justify-center transition
          ${
            qty > 0
              ? "text-primary cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
        disabled={qty <= 0}
      >
        <FaMinus className="w-3 h-3" />
      </button>

      {/* Jumlah */}
      <span className="text-black text-lg w-5 text-center">{qty}</span>

      {/* Tombol Plus */}
      <button
        onClick={() => setQty(qty + 1)}
        className="border border-primary bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
      >
        <FaPlus className="w-3 h-3" />
      </button>
    </div>
  );
}
