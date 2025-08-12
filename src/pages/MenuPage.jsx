import React, { useState } from "react";
import HeaderMenu from "../components/Header/HeaderMenu";
import MenuCard from "../components/Card/MenuCard";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";

const seller = {
  name: "DAPUR UJE",
  description: "Ayam dan mie hot plate",
  banner:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80",
  image:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=200&q=80",
};

const menuItemsData = [
  {
    id: 1,
    name: "Nasi Katsu",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Nasi Ayam Teriyaki",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Mie Hot Plate",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Ayam Crispy",
    price: 17000,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
];

export default function MenuPage({ cart, setCart, showCart, setShowCart }) {
  const [searchTerm, setSearchTerm] = useState("");

  function addToCart(id) {
    const item = menuItemsData.find((menu) => menu.id === id);
    setCart((prev) => {
      if (!prev[id]) {
        return { ...prev, [id]: { ...item, qty: 1 } };
      }
      return {
        ...prev,
        [id]: { ...prev[id], qty: prev[id].qty + 1 },
      };
    });
  }

  function decreaseQty(id) {
    setCart((prev) => {
      if (!prev[id]) return prev;
      if (prev[id].qty === 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: { ...prev[id], qty: prev[id].qty - 1 },
      };
    });
  }

  const filteredMenu = menuItemsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartItems = Object.values(cart).reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* CART POPUP */}
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <HeaderMenu seller={seller} />

      <div className="mx-auto px-5 md:px-15 pt-20">
        {/* Search & Cart */}
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Cari Menu.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="ml-4 relative">
            <CartButton
              totalCartItems={totalCartItems}
              bgColor="bg-primary"
              iconColor="text-white"
              badgeColor="bg-primary"
              badgeTextColor="text-white"
              onClick={() => setShowCart(true)}
            />
          </div>
        </div>

        {/* Menu list */}
        <h3 className="font-bold text-lg md:text-xl mb-3">Semua Menu</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMenu.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              qty={cart[item.id]?.qty || 0}
              addToCart={addToCart}
              decreaseQty={decreaseQty}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
