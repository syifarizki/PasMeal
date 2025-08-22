import React from "react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "../QuantityControl";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; 

export default function MenuCard({ item, qty = 0, addToCart, decreaseQty }) {
  const navigate = useNavigate();

  const goToDetail = () => {
    if (!item.isAvailable) return;
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
        onClick={goToDetail}
        className={`cursor-pointer ${
          isButtonDisabled ? "pointer-events-none" : ""
        }`}
      >
        <LazyLoadImage
          src={item.image || "/images/menudefault.jpg"}
          alt={item.name || "Menu"}
          className="w-full aspect-video object-cover rounded-sm"
          effect="blur" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/menudefault.jpg";
          }}
        />
        <div className="p-3 flex flex-col items-center">
          <h4 className="mt-2 text-base font-bold">{item.name || "Menu"}</h4>
          <p className="text-base text-primary">
            Rp. {(item.price ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="p-3 pt-0">
        {qty <= 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isButtonDisabled) addToCart(item.id);
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
