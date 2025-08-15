import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderMenu from "../components/Header/HeaderMenu";
import MenuCard from "../components/Card/MenuCard";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";

export default function MenuPage({ cart, setCart, showCart, setShowCart }) {
  const { kiosId } = useParams();
  const [kios, setKios] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data kios
  useEffect(() => {
    const fetchKios = async () => {
      try {
        const data = await Kios.getById(kiosId);
        setKios(data);
      } catch (err) {
        console.error("Gagal ambil kios:", err);
      }
    };
    fetchKios();
  }, [kiosId]);

  // Ambil menu kios
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await Kios.getMenusByKios(kiosId);
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.nama_menu,
          price: item.harga,
          image: item.gambar_menu
            ? `${import.meta.env.VITE_API_URL}/uploads/${item.gambar_menu}`
            : "/images/menudefault.jpg", 
        }));
        setMenuItems(mapped);
      } catch (err) {
        console.error("Gagal ambil menu kios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [kiosId]);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartItems = Object.values(cart).reduce(
    (total, item) => total + item.qty,
    0
  );

  function addToCart(id) {
    const item = menuItems.find((menu) => menu.id === id);
    setCart((prev) => {
      if (!prev[id]) return { ...prev, [id]: { ...item, qty: 1 } };
      return { ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } };
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
      return { ...prev, [id]: { ...prev[id], qty: prev[id].qty - 1 } };
    });
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {showCart && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
        />
      )}

      <HeaderMenu kios={kios} />

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

        {loading ? (
          <p className="text-center text-gray-500">Loading menu...</p>
        ) : filteredMenu.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-500">Tidak ada menu ditemukan</p>
        )}
      </div>
    </div>
  );
}
