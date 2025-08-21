import React, { useState, useEffect } from "react";
import HeaderKios from "../components/Header/HeaderKios";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";
import { useCart } from "../context/CartContext"; // ⬅️ import hook context

export default function KiosPage() {
  const { cart, setCart, showCart, setShowCart } = useCart(); // ⬅️ ambil dari context
  const [search, setSearch] = useState("");
  const [kiosList, setKiosList] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchKios = async () => {
        setLoading(true);
        const data = await Kios.getAll(search);
        setKiosList(data);
        setLoading(false);
      };
      fetchKios();
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div>
      <HeaderKios />
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <div className="relative z-10 px-4 md:px-10 py-6 -mt-10 rounded-t-[30px] bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-6 -mt-10 md:-mt-15 w-full">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Kios..."
          />
          <CartButton
            totalCartItems={totalCartItems}
            iconColor="text-white"
            badgeColor="bg-white"
            badgeTextColor="text-primary"
            onClick={() => setShowCart(true)}
          />
        </div>

        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">
              Loading kios...
            </p>
          ) : kiosList.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {kiosList.map((kios) => (
                <KiosCard
                  key={kios.id || kios._id}
                  kiosId={kios.id || kios._id}
                  name={kios.nama_kios}
                  description={kios.deskripsi}
                  gambar_kios={kios.gambar_kios}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              {search
                ? `Kios dengan nama "${search}" tidak ditemukan`
                : "Belum ada kios yang terdaftar"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
