import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Header from "../components/Header/Header";
import NewMenuSlider from "../components/NewMenuSlider";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";
import { useCart } from "../context/CartContext"; // ⬅️ import context

export default function HomePage() {
  const { cart, setCart, showCart, setShowCart } = useCart(); // ⬅️ ambil dari context
  const [search, setSearch] = useState("");
  const [kiosList, setKiosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  useEffect(() => {
    const fetchKios = async () => {
      setLoading(true);

      if (search.trim() !== "") {
        const allKios = await Kios.getAll();
        const result = await Kios.searchAll(search);

        const kiosIdsFromMenu = [
          ...new Set(result.menus.map((menu) => menu.kios_id)),
        ];

        const kiosToShow = allKios.filter(
          (kios) =>
            kiosIdsFromMenu.includes(kios.id) ||
            kios.nama_kios.toLowerCase().includes(search.toLowerCase())
        );

        setKiosList(kiosToShow);
      } else {
        const data = await Kios.getHomepage();
        setKiosList(data);
      }

      setLoading(false);
    };

    fetchKios();
  }, [search]);

  return (
    <div className="bg-gray-100 font-sans overflow-x-hidden">
      <Header />

      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <div className="relative z-10 px-4 md:px-10 pt-8 pb-5 -mt-10 rounded-t-[30px] bg-white flex flex-col">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6 -mt-12 md:-mt-15 w-full">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kios atau menu..."
          />
          <CartButton
            totalCartItems={totalCartItems}
            iconColor="text-white"
            badgeColor="bg-white"
            badgeTextColor="text-primary"
            onClick={() => setShowCart(true)}
          />
        </div>

        {/* New Menus Slider */}
        <NewMenuSlider />

        {/* Kios Section */}
        <div className="flex-1 mt-6">
          <div className="flex items-center mb-4">
            <h3 className="hidden md:block font-extrabold text-primary text-2xl lg:text-3xl">
              Yuk, Lihat Kios!
            </h3>
            <button
              onClick={() => navigate("/KiosPage")}
              className="ml-auto text-black md:text-white rounded-lg px-3 py-1 md:bg-black text-base font-semibold flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua
              <FiChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-gray-500 col-span-full text-center">
                Loading kios...
              </p>
            ) : kiosList.length > 0 ? (
              kiosList.map((kios) => (
                <KiosCard
                  key={kios.id || kios._id}
                  kiosId={kios.id || kios._id}
                  name={kios.nama_kios}
                  description={kios.deskripsi}
                  gambar_kios={kios.gambar_kios}
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
