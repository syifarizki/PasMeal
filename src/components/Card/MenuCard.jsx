import React from "react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "../QuantityControl";

export default function MenuCard({ item, qty = 0, addToCart, decreaseQty }) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/DetailMenuPage/${item.id}`);
  };

  const handleSetQty = (newQty) => {
    if (!item.isAvailable) return;
    if (newQty > qty) addToCart(item.id);
    else if (newQty < qty) decreaseQty(item.id);
  };

  const isButtonDisabled = !item.isAvailable;

  return (
    <div
      className={`bg-white rounded-md shadow overflow-hidden flex flex-col transition ${
        isButtonDisabled ? "opacity-60" : "hover:shadow-lg"
      }`}
    >
      <div
        onClick={isButtonDisabled ? null : goToDetail}
        className="cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-28 object-cover rounded-sm"
        />
        <div className="p-3 flex flex-col items-center">
          <h4 className="mt-2 text-base font-bold">{item.name}</h4>
          <p className="text-base text-primary">
            Rp. {item.price.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="p-3 pt-0">
        {qty <= 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isButtonDisabled) {
                addToCart(item.id);
              }
            }}
            disabled={isButtonDisabled} 
            className={`mt-2 rounded-xl md:rounded-lg px-3 py-1 text-xs md:text-base font-semibold w-full cursor-pointer
              bg-primary text-white
              ${isButtonDisabled ? "cursor-not-allowed" : ""}`} 
          >
            Tambah Keranjang
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 flex justify-center"
          >
            {/* Tampilkan QuantityControl hanya jika menu tersedia */}
            {item.isAvailable ? (
              <QuantityControl qty={qty} setQty={handleSetQty} />
            ) : (
              <p className="text-sm font-semibold text-gray-500">
                Menu tidak tersedia
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
