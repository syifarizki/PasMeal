import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Header from "../components/Header/Header";
import NewMenuSlider from "../components/NewMenuSlider";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";

const traditionalMenus = new Array(8).fill({
  name: "Jajanan Tradisional",
  description: "Berbagai macam jajanan dan gorengan",
  image: "/images/asd.jpeg",
});

export default function HomePage({ cart, setCart, showCart, setShowCart }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Hitung total item di cart
  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  return (
    <div className="bg-gray-100 font-sans overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Cart Popup */}
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
            placeholder="Cari Menu..."
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

        {/* Kios */}
        <div className="flex-1">
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
            {traditionalMenus.map((menu, index) => (
              <KiosCard
                key={index}
                name={menu.name}
                description={menu.description}
                image={menu.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
