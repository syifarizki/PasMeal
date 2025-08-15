import React, { useState, useEffect } from "react";
import HeaderKios from "../components/Header/HeaderKios";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";

export default function KiosPage({ cart, setCart, showCart, setShowCart }) {
  const [search, setSearch] = useState("");
  const [kiosList, setKiosList] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  useEffect(() => {
    const fetchKios = async () => {
      const data = await Kios.getAll();
      setKiosList(data);
      setLoading(false);
    };
    fetchKios();
  }, []);

  const filteredKios = kiosList.filter((kios) =>
    kios.nama_kios?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 font-sans overflow-x-hidden min-h-screen">
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
          ) : filteredKios.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredKios.map((kios) => (
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
              Tidak ada kios ditemukan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
