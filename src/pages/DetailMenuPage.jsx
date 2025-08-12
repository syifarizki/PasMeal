// DetailMenuPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";

export default function DetailMenuPage({ cart, setCart, menuItems }) {
  const { id } = useParams();
  const menu = menuItems.find((item) => item.id === parseInt(id)) || {};

  const [showCart, setShowCart] = React.useState(false);

  // hitung total qty semua item
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  const addToCart = (menuId) => {
    setCart((prev) => {
      const existing = prev[menuId];
      if (existing) {
        return {
          ...prev,
          [menuId]: { ...existing, qty: existing.qty + 1 },
        };
      }
      return {
        ...prev,
        [menuId]: {
          id: menu.id,
          name: menu.name,
          price: menu.price,
          image: menu.image,
          qty: 1,
        },
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      {/* MOBILE & TABLET */}
      <div className="lg:hidden">
        <div className="relative w-full h-72 md:h-[300px]">
          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
          />

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-8 left-5 flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20"
          >
            <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Cart button */}
          <div className="absolute top-8 right-8">
            <CartButton
              totalCartItems={totalCartItems}
              bgColor="bg-white"
              iconColor="text-primary"
              badgeColor="bg-primary"
              badgeTextColor="text-white"
              onClick={() => setShowCart(true)}
            />
          </div>
        </div>

        {/* Detail */}
        <div className="p-5 md:p-8 bg-white">
          <h2 className="font-extrabold text-xl md:text-3xl mb-2">
            {menu.name}
          </h2>
          <p className="text-black font-medium text-base md:text-lg mb-4">
            {menu.description}
          </p>

          {/* Harga & Tombol */}
          <div className="flex items-center justify-between">
            <p className="text-primary font-medium text-lg md:text-xl">
              Rp {menu.price?.toLocaleString("id-ID")}
            </p>
            <button
              onClick={() => addToCart(menu.id)}
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Tambah Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex flex-col flex-1 bg-white">
        <div
          className="px-6 py-6 flex items-center justify-between relative bg-cover bg-center"
          style={{ backgroundImage: `url('/images/bg.png')` }}
        >
          <h1 className="text-white font-bold text-2xl relative z-10">
            Detail Menu
          </h1>
          <div className="absolute right-6 z-10">
            <CartButton
              totalCartItems={totalCartItems}
              bgColor="bg-white"
              iconColor="text-primary"
              badgeColor="bg-white"
              badgeTextColor="text-primary"
              onClick={() => setShowCart(true)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-8 p-6">
          <div className="w-1/3 flex">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between mt-5">
            <div>
              <h2 className="font-extrabold text-2xl mb-3">{menu.name}</h2>
              <p className="text-black font-medium text-xl mb-4">
                {menu.description}
              </p>
              <p className="text-primary font-medium text-xl">
                Rp {menu.price?.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => addToCart(menu.id)}
              className="bg-primary text-lg text-white font-semibold px-4 py-2 rounded-lg w-fit"
            >
              Tambah Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
