import React, { useState } from "react";
import HeaderKios from "../components/Header/HeaderKios";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import KiosCard from "../components/Card/KiosCard";
import Cart from "../components/Cart";

const traditionalMenus = new Array(8).fill({
  name: "Jajanan Tradisional",
  description: "Berbagai macam jajanan dan gorengan",
  image: "/images/asd.jpeg",
});

export default function KiosPage({ cart, setCart, showCart, setShowCart }) {
  const [search, setSearch] = useState("");
  // Hitung total item di cart
  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
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
