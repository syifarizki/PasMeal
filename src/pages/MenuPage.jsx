import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderMenu from "../components/Header/HeaderMenu";
import MenuCard from "../components/Card/MenuCard";
import SearchBar from "../components/SearchBar";
import CartButton from "../components/CartButton";
import Cart from "../components/Cart";
import { Kios } from "../services/Kios";
import { Keranjang } from "../services/Keranjang";

// untuk menampilkan semua menu dan hasil search
const mapApiToMenuState = (apiData) => ({
  id: apiData.id,
  name: apiData.nama_menu,
  price: apiData.harga,
  isAvailable: apiData.status_tersedia,
  image: apiData.foto_menu
    ? `${import.meta.env.VITE_API_URL}/uploads/${apiData.foto_menu}`
    : "/images/menudefault.jpg",
});

export default function MenuPage({ cart, setCart, showCart, setShowCart }) {
  const { kiosId } = useParams();
  const [kios, setKios] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  // konsisten pakai guest_id
  const [guestId] = useState(() => {
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = `guest-${Date.now()}`;
      localStorage.setItem("guest_id", id);
    }
    return id;
  });

  // fetch kios & menu
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

  // fetch keranjang awal
  useEffect(() => {
    const fetchInitialCart = async () => {
      if (guestId && Object.keys(cart).length === 0 && !isCartInitialized) {
        try {
          const keranjangData = await Keranjang.getKeranjang(guestId);
          if (keranjangData && keranjangData.length > 0) {
            const mappedCart = keranjangData.reduce((acc, item) => {
              const menuId = item.menu_id ?? item.menu?.id;
              if (menuId) {
                acc[menuId] = {
                  cartId: item.id,
                  id: menuId,
                  name: item.menu?.nama ?? item.nama_menu ?? "Menu",
                  price: item.menu?.harga ?? item.harga ?? 0,
                  image:
                    item.menu?.foto_url ??
                    (item.foto_menu
                      ? `${import.meta.env.VITE_API_URL}/uploads/${
                          item.foto_menu
                        }`
                      : "/images/menudefault.jpg"),
                  qty: item.jumlah ?? 0,
                };
              }
              return acc;
            }, {});
            setCart(mappedCart);
          }
        } catch (err) {
          console.error("Gagal mengambil keranjang:", err);
        } finally {
          setIsCartInitialized(true);
        }
      } else if (!isCartInitialized) {
        setIsCartInitialized(true);
      }
    };

    fetchInitialCart();
  }, [guestId, cart, setCart, isCartInitialized]);

  // tambah item ke cart
  const addToCart = async (id) => {
    const item = menuItems.find((menu) => menu.id === id);
    if (!item || !item.isAvailable) return;

    const existingCartItem = cart[id];
    if (!existingCartItem) {
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
      const newQty = existingCartItem.qty + 1;
      try {
        await Keranjang.updateItem(guestId, existingCartItem.cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [id]: { ...prev[id], qty: newQty },
        }));
      } catch (err) {
        console.error("Gagal update jumlah:", err);
      }
    }
  };

  // kurangi qty / hapus item
  const decreaseQty = async (id) => {
    const existingCartItem = cart[id];
    if (!existingCartItem) return;

    const newQty = existingCartItem.qty - 1;
    if (newQty <= 0) {
      try {
        await Keranjang.removeItem(guestId, existingCartItem.cartId);
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
        await Keranjang.updateItem(guestId, existingCartItem.cartId, newQty);
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
                addToCart={() => addToCart(item.id)}
                decreaseQty={() => decreaseQty(item.id)}
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
