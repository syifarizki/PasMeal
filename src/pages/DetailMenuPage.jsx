import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Menu } from "../services/Menu";
import { Keranjang } from "../services/Keranjang";
import QuantityControl from "../components/QuantityControl";
import { useCart } from "../context/CartContext"; 

export default function DetailMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(null);
  const [qty, setQty] = useState(0);

  // Ambil dari context
  const { cart, setCart, showCart, setShowCart, guest_id } = useCart();

  // Fetch detail menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await Menu.getMenuById(id);
        if (data) setMenu(data);
      } catch (err) {
        console.error("Gagal ambil detail menu:", err);
      }
    };
    if (id) {
      fetchMenu();
    }
  }, [id]);

  useEffect(() => {
    const cartItem = cart[id];
    setQty(cartItem ? cartItem.qty : 0);
  }, [cart, id]);

  // 🔥 handleQuantityChange pakai context
  const handleQuantityChange = useCallback(
    async (newQty) => {
      if (!menu || !guest_id) return; // ⬅️ ganti guestId → guest_id
      const cartItem = cart[id];

      try {
        if (!cartItem && newQty > 0) {
          const res = await Keranjang.addItem(guest_id, menu.id, newQty);
          if (res) {
            setCart((prev) => ({
              ...prev,
              [id]: {
                id: menu.id,
                cartId: res.id,
                name: menu.name,
                price: menu.price,
                image: menu.image,
                qty: newQty,
              },
            }));
          } else {
            alert(
              "Gagal menambahkan item. Mungkin keranjang Anda berisi item dari kios lain?"
            );
          }
        } else if (cartItem) {
          if (newQty <= 0) {
            await Keranjang.removeItem(guest_id, cartItem.cartId);
            setCart((prev) => {
              const newCart = { ...prev };
              delete newCart[id];
              return newCart;
            });
          } else {
            const updated = await Keranjang.updateItem(
              guest_id,
              cartItem.cartId,
              newQty
            );
            if (updated) {
              setCart((prev) => ({
                ...prev,
                [id]: { ...prev[id], qty: updated.jumlah },
              }));
            }
          }
        }
      } catch (error) {
        console.error("Gagal memproses keranjang:", error);
        alert("Terjadi kesalahan saat memproses keranjang Anda.");
      }
    },
    [id, menu, guest_id, cart, setCart] // ⬅️ ganti guestId → guest_id
  );

  const totalCartItems = Object.values(cart || {}).reduce(
    (acc, item) => acc + (item.qty || 0),
    0
  );

  const handleGoBack = () => navigate(-1);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/menudefault.jpg";
  };

  if (!menu) {
    return <p className="p-5 text-center">Memuat detail menu...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          guest_id={guest_id}
        />
      )}

      {/* MOBILE & TABLET */}
      <div className="lg:hidden">
        <div className="relative w-full h-72 md:h-[300px]">
          <img
            src={menu.image || "/images/menudefault.jpg"}
            alt={menu.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <button
            onClick={handleGoBack}
            className="absolute top-8 left-5 flex items-center justify-center w-10 h-10 text-white rounded-full bg-black/20"
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
        <div className="p-5 bg-white">
          <h2 className="font-extrabold text-xl mb-2">{menu.name}</h2>
          <p className="text-black font-medium text-lg mb-3">
            {menu.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-primary font-bold text-lg">
              Rp {menu.price?.toLocaleString("id-ID")}
            </p>
            <div>
              {qty === 0 ? (
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="bg-primary text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Tambah Keranjang
                </button>
              ) : (
                <QuantityControl qty={qty} setQty={handleQuantityChange} />
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
        <div className="flex-1 flex p-10 pl-16">
          <div className="flex flex-row gap-x-10">
            <div>
              <img
                src={menu.image || "/images/menudefault.jpg"}
                alt={menu.name}
                className="w-88 h-88 object-cover rounded-lg shadow-lg"
                onError={handleImageError}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-extrabold text-2xl mb-2">{menu.name}</h2>
              <p className="text-black font-medium text-xl mb-2">
                {menu.description}
              </p>
              <p className="text-primary font-bold text-xl mb-4">
                Rp {menu.price?.toLocaleString("id-ID")}
              </p>
              <div className="mt-47">
                {qty === 0 ? (
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-primary text-lg text-white font-semibold px-6 py-2 rounded-lg w-fit cursor-pointer shadow-md hover:bg-primary/90 transition"
                  >
                    Tambah Keranjang
                  </button>
                ) : (
                  <QuantityControl qty={qty} setQty={handleQuantityChange} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
