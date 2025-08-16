import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Menu } from "../services/Menu";
import { Keranjang } from "../services/Keranjang";
import QuantityControl from "../components/QuantityControl";

export default function DetailMenuPage({ cart, setCart }) {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [qty, setQtyState] = useState(0); // state lokal untuk qty

  // guestId
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest-${Date.now()}`;
    localStorage.setItem("guestId", guestId);
  }

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.qty,
    0
  );

  // Ambil detail menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await Menu.getMenuById(id);
        if (data) setMenu(data);
      } catch (err) {
        console.error("Gagal ambil detail menu:", err);
      }
    };
    fetchMenu();
  }, [id]);

  // Sinkron qty dengan cart setiap kali cart berubah
  useEffect(() => {
    const cartItem = cart[id];
    setQtyState(cartItem ? cartItem.qty : 0);
  }, [cart, id]);

  // Fungsi update qty
  const setQty = async (newQty) => {
    if (!menu) return;

    if (!cart[id] && newQty > 0) {
      const res = await Keranjang.addItem(guestId, menu.id, newQty);
      setCart((prev) => ({
        ...prev,
        [id]: { ...menu, qty: newQty, cartId: res.id },
      }));
    } else if (cart[id]) {
      if (newQty <= 0) {
        await Keranjang.removeItem(guestId, cart[id].cartId);
        setCart((prev) => {
          const tmp = { ...prev };
          delete tmp[id];
          return tmp;
        });
      } else {
        await Keranjang.updateItem(guestId, cart[id].cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      }
    }
  };

  if (!menu) return <p className="p-5">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          guestId={guestId}
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
          <button
            onClick={() => window.history.back()}
            className="absolute top-8 left-5 flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20"
          >
            <FiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
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

        <div className="p-5 md:p-8 bg-white">
          <h2 className="font-extrabold text-xl md:text-3xl mb-2">
            {menu.name}
          </h2>
          <p className="text-black font-medium text-base md:text-lg mb-4">
            {menu.description}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-primary font-medium text-lg md:text-xl">
              Rp {menu.price?.toLocaleString("id-ID")}
            </p>
            <div>
              {qty === 0 ? (
                <button
                  onClick={() => setQty(1)}
                  className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Tambah Keranjang
                </button>
              ) : (
                <QuantityControl qty={qty} setQty={setQty} />
              )}
            </div>
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

            <div>
              {qty === 0 ? (
                <button
                  onClick={() => setQty(1)}
                  className="bg-primary text-lg text-white font-semibold px-4 py-2 rounded-lg w-fit cursor-pointer hover:bg-orange-600 transition-colors duration-200"
                >
                  Tambah Keranjang
                </button>
              ) : (
                <QuantityControl qty={qty} setQty={setQty} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
