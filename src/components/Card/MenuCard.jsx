import React from "react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "../QuantityControl"; // pastikan path sesuai

export default function MenuCard({ item, qty = 0, addToCart, decreaseQty }) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/DetailMenuPage/${item.id}`);
  };

  const handleSetQty = (newQty) => {
    if (newQty > qty) {
      addToCart(item.id);
    } else if (newQty < qty) {
      decreaseQty(item.id);
    }
  };

  return (
    <div className="bg-white rounded-md shadow overflow-hidden flex flex-col hover:shadow-lg transition">
      {/* Bagian Gambar + Nama + Harga */}
      <div onClick={goToDetail} className="cursor-pointer">
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

      {/* Bagian Kontrol Keranjang */}
      <div className="p-3 pt-0">
        {qty <= 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item.id);
            }}
            className="mt-2 bg-primary text-white rounded-xl md:rounded-lg px-3 py-1 text-xs md:text-base font-semibold w-full cursor-pointer"
          >
            Tambah Keranjang
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 flex justify-center"
          >
            <QuantityControl qty={qty} setQty={handleSetQty} />
          </div>
        )}
      </div>
    </div>
  );
}
