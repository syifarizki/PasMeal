// src/pages/MenuPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderMenu from "../components/Header/HeaderMenu";
import MenuCard from "../components/Card/MenuCard";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";
import { Keranjang } from "../services/Keranjang";

export default function MenuPage({ cart, setCart, showCart, setShowCart }) {
  const { kiosId } = useParams();
  const [kios, setKios] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // guestId
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest-${Date.now()}`;
    localStorage.setItem("guestId", guestId);
  }

  // Ambil data kios
  useEffect(() => {
    (async () => {
      try {
        const data = await Kios.getById(kiosId);
        setKios(data);
      } catch (err) {
        console.error("Gagal ambil kios:", err);
      }
    })();
  }, [kiosId]);

  // Ambil menu kios
  useEffect(() => {
    (async () => {
      try {
        const data = await Kios.getMenusByKios(kiosId);
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.nama_menu,
          price: item.harga,
          image: item.foto_menu
            ? `${import.meta.env.VITE_API_URL}/uploads/${item.foto_menu}`
            : "/images/menudefault.jpg",
        }));
        setMenuItems(mapped);
      } catch (err) {
        console.error("Gagal ambil menu kios:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [kiosId]);

  // Ambil keranjang dari backend
  useEffect(() => {
    (async () => {
      try {
        const keranjangData = await Keranjang.getKeranjang(guestId);

        const mappedCart = (
          Array.isArray(keranjangData) ? keranjangData : []
        ).reduce((acc, item) => {
          const menuId = item.menu_id ?? item.menu?.id;
          const name = item.menu?.nama ?? item.nama_menu ?? "Menu";
          const price = item.menu?.harga ?? item.harga ?? 0;
          const image =
            item.menu?.foto_url ??
            (item.foto_menu
              ? `${import.meta.env.VITE_API_URL}/uploads/${item.foto_menu}`
              : "/images/menudefault.jpg");

          acc[menuId] = {
            cartId: item.id, // id keranjang
            id: menuId,
            name,
            price,
            image,
            qty: item.jumlah ?? 0,
          };
          return acc;
        }, {});

        setCart(mappedCart);
      } catch (err) {
        console.error("Gagal ambil keranjang:", err);
      }
    })();
  }, [guestId, setCart]);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartItems = Object.values(cart || {}).reduce(
    (total, item) => total + (item.qty || 0),
    0
  );

  // Tambah item ke keranjang
  async function addToCart(id) {
    const item = menuItems.find((menu) => menu.id === id);
    if (!item) return;

    if (!cart[id]) {
      try {
        const res = await Keranjang.addItem(guestId, id, 1);
        setCart((prev) => ({
          ...prev,
          [id]: { ...item, qty: 1, cartId: res.id },
        }));
      } catch (err) {
        console.error("Gagal tambah ke keranjang:", err);
      }
    } else {
      const newQty = cart[id].qty + 1;
      try {
        await Keranjang.updateItem(guestId, cart[id].cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      } catch (err) {
        console.error("Gagal update jumlah:", err);
      }
    }
  }

  // Kurangi item dari keranjang
  async function decreaseQty(id) {
    if (!cart[id]) return;

    const newQty = cart[id].qty - 1;

    if (newQty <= 0) {
      try {
        await Keranjang.removeItem(guestId, cart[id].cartId);
        setCart((prev) => {
          const tmp = { ...prev };
          delete tmp[id];
          return tmp;
        });
      } catch (err) {
        console.error("Gagal hapus item:", err);
      }
    } else {
      try {
        await Keranjang.updateItem(guestId, cart[id].cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      } catch (err) {
        console.error("Gagal update jumlah:", err);
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {showCart && (
        <Cart
          guestId={guestId}
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
                addToCart={() => addToCart(item.id)}
                decreaseQty={() => decreaseQty(item.id)}
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
