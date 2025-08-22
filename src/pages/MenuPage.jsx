import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderMenu from "../components/Header/HeaderMenu";
import MenuCard from "../components/Card/MenuCard";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";
import { Keranjang } from "../services/Keranjang";
import { useCart } from "../context/CartContext";

const mapApiToMenuState = (apiData) => ({
  id: apiData.id,
  name: apiData.nama_menu,
  price: apiData.harga,
  isAvailable: apiData.status_tersedia,
  image: apiData.foto_menu
    ? `${import.meta.env.VITE_API_URL}/uploads/${apiData.foto_menu}`
    : "/images/menudefault.jpg",
});

export default function MenuPage() {
  const { kiosId } = useParams();
  const [kios, setKios] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { cart, setCart, showCart, setShowCart, guest_id } = useCart();

  useEffect(() => {
    const fetchKiosAndMenus = async () => {
      if (!kiosId) return;
      setLoading(true);
      try {
        const [kiosData, menuData] = await Promise.all([
          Kios.getById(kiosId),
          Kios.getMenusByKios(kiosId, searchTerm),
        ]);
        setKios(kiosData);
        setMenuItems(menuData.map(mapApiToMenuState));
      } catch (err) {
        console.error("Gagal mengambil data kios atau menu:", err);
      } finally {
        setLoading(false);
      }
    };
    const handler = setTimeout(fetchKiosAndMenus, 300);
    return () => clearTimeout(handler);
  }, [kiosId, searchTerm]);

  const addToCart = async (id) => {
    if (!guest_id) return;
    const item = menuItems.find((menu) => menu.id === id);
    if (!item || !item.isAvailable) return;

    const existingCartItem = cart[id];
    if (!existingCartItem) {
      try {
        const res = await Keranjang.addItem(guest_id, id, 1);
        if (res?.id) {
          setCart((prev) => ({
            ...prev,
            [id]: { ...item, qty: 1, cartId: res.id },
          }));
        }
      } catch (err) {
        console.error("Gagal tambah ke keranjang:", err);
      }
    } else {
      const newQty = existingCartItem.qty + 1;
      try {
        await Keranjang.updateItem(guest_id, existingCartItem.cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      } catch (err) {
        console.error("Gagal update jumlah:", err);
      }
    }
  };

  const decreaseQty = async (id) => {
    if (!guest_id) return;
    const existingCartItem = cart[id];
    if (!existingCartItem) return;

    const newQty = existingCartItem.qty - 1;
    if (newQty <= 0) {
      try {
        await Keranjang.removeItem(guest_id, existingCartItem.cartId);
        setCart((prev) => {
          const newCart = { ...prev };
          delete newCart[id];
          return newCart;
        });
      } catch (err) {
        console.error("Gagal hapus item:", err);
      }
    } else {
      try {
        await Keranjang.updateItem(guest_id, existingCartItem.cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      } catch (err) {
        console.error("Gagal update jumlah:", err);
      }
    }
  };

  const totalCartItems = Object.values(cart || {}).reduce(
    (total, item) => total + (item.qty || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {showCart && <Cart onClose={() => setShowCart(false)} />}
      <HeaderMenu kios={kios} />
      <div className="mx-auto px-5 md:px-15 pt-20">
        <div className="sticky top-5 z-50 flex items-center mb-6 ">
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

        <h3 className="font-bold text-lg md:text-xl mb-3">Semua Menu</h3>
        {loading ? (
          <p className="text-center text-gray-500">Memuat menu...</p>
        ) : menuItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                qty={cart[item.id]?.qty || 0}
                addToCart={addToCart}
                decreaseQty={decreaseQty}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {searchTerm
              ? `Menu dengan nama "${searchTerm}" tidak ditemukan`
              : "Kios ini belum memiliki menu"}
          </p>
        )}
      </div>
    </div>
  );
}
