import React, { useState, useEffect, createContext, useContext } from "react";
import { Keranjang } from "../services/Keranjang";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [guest_id, setGuestId] = useState(null);

  // --- Generate guest_id ---
  useEffect(() => {
    let currentGuestId = localStorage.getItem("guest_id");
    if (!currentGuestId) {
      currentGuestId = `guest-${Date.now()}`;
      localStorage.setItem("guest_id", currentGuestId);
    }
    setGuestId(currentGuestId);
  }, []);

  // --- Fetch Cart dari backend ---
  const fetchCart = async () => {
    if (!guest_id) return;
    try {
      const keranjangData = await Keranjang.getKeranjang(guest_id);
      if (keranjangData?.items?.length > 0) {
        const mappedCart = keranjangData.items.reduce((acc, item) => {
          const menuId = item.menu_id;
          if (menuId) {
            acc[menuId] = {
              cartId: item.id,
              id: menuId,
              name: item.nama_menu,
              price: item.harga,
              image: item.foto_menu
                ? `${import.meta.env.VITE_API_URL}/uploads/${item.foto_menu}`
                : "/images/menudefault.jpg",
              qty: item.jumlah,
              kiosId: item.kios_id,
            };
          }
          return acc;
        }, {});
        setCart(mappedCart);
      } else {
        setCart({});
      }
    } catch (err) {
      console.error("Gagal mengambil keranjang:", err);
    }
  };

  // --- Update qty item ---
  const updateQty = async (menuId, newQty) => {
    try {
      if (newQty <= 0) {
        await Keranjang.removeItem(guest_id, cart[menuId].cartId);
        removeItem(menuId);
      } else {
        await Keranjang.updateItem(guest_id, cart[menuId].cartId, newQty);
        setCart((prev) => ({
          ...prev,
          [menuId]: { ...prev[menuId], qty: newQty },
        }));
      }
    } catch (err) {
      console.error("Gagal update qty:", err);
    }
  };

  // --- Hapus item ---
  const removeItem = async (menuId) => {
    try {
      await Keranjang.removeItem(guest_id, cart[menuId].cartId);
      setCart((prev) => {
        const newCart = { ...prev };
        delete newCart[menuId];
        return newCart;
      });
    } catch (err) {
      console.error("Gagal hapus item:", err);
    }
  };

  // Load cart pertama kali
  useEffect(() => {
    if (guest_id) fetchCart();
  }, [guest_id]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        showCart,
        setShowCart,
        guest_id,
        fetchCart,
        updateQty,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
