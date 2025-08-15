import React, { useState, useEffect } from "react";
import HeaderKios from "../components/Header/HeaderKios";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios"; // pastikan service axios sudah dibuat

export default function KiosPage({ cart, setCart, showCart, setShowCart }) {
  const [search, setSearch] = useState("");
  const [kiosList, setKiosList] = useState([]);

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  // Fetch kios dari backend
  const fetchKios = async () => {
    try {
      const data = await Kios.getAll(); // GET /kios
      setKiosList(data);
    } catch (err) {
      console.error("Gagal ambil kios:", err);
    }
  };

  useEffect(() => {
    fetchKios();
  }, []);

  // Filter berdasarkan search
  const filteredKios = kiosList.filter((kios) =>
    kios.nama_kios.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 font-sans overflow-x-hidden">
      {/* Header */}
      <HeaderKios />

      {/* Cart Popup */}
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <div className="relative z-10 px-4 md:px-10 py-6 -mt-10 rounded-t-[30px] bg-white flex flex-col">
        {/* Search Bar */}
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

        {/* Kios */}
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredKios.length > 0 ? (
              filteredKios.map((kios) => (
                <KiosCard
                  key={kios.id}
                  kiosId={kios.id} // untuk navigasi menu
                  name={kios.nama_kios}
                  description={
                    kios.deskripsi || "Deskripsi kios belum tersedia"
                  }
                  image={
                    kios.gambar_kios
                      ? `${import.meta.env.VITE_API_URL}/uploads/${
                          kios.gambar_kios
                        }?t=${Date.now()}`
                      : "/images/menudefault.jpg"
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                Tidak ada kios ditemukan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
