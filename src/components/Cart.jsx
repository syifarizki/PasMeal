import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "./QuantityControl";
import PrimaryButton from "./PrimaryButton";

export default function Cart({ cart, setCart, onClose }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  // Load cart dari localStorage saat pertama kali
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  // Simpan cart ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Cek ukuran layar
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleCheckout = () => {
    navigate("/OrderConfirmationPage");
  };

  // 🔹 Fungsi untuk update qty di cart
  const updateCartQty = (id, newQty) => {
    setCart((prev) => {
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return {
        ...prev,
        [id]: { ...prev[id], qty: newQty },
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:justify-end">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose}></div>

      {/* Cart Container */}
      <div
        className={`bg-white shadow-lg flex flex-col max-h-screen
          ${
            isDesktop
              ? "lg:fixed lg:top-0 lg:right-0 lg:bottom-0 lg:rounded-none lg:rounded-l-2xl lg:w-[400px] animate-slideInRight"
              : "w-full rounded-t-2xl fixed bottom-0 animate-slideInUp"
          }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-4 border-b">
          <h2 className="font-bold text-lg">Keranjang Saya</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white bg-orange-500 rounded-full p-1 cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Keranjang */}
        <div className="flex-1 overflow-y-auto p-4 mb-3">
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-500">Keranjang kosong</p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(cart).map(([id, item]) => (
                <li key={id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-orange-500 text-sm">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* QuantityControl */}
                  <QuantityControl
                    qty={item.qty}
                    setQty={(newQty) => updateCartQty(id, newQty)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
       
        <div className="p-4 shadow-2xl shadow-black">
          <div className="flex justify-between font-semibold mb-3">
            <span>Total Harga</span>
            <span className="text-orange-500">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <PrimaryButton
            text="Lanjut"
            onClick={handleCheckout}
            disabled={Object.keys(cart).length === 0} 
            className="w-full py-0"
          />
        </div>
      </div>

      {/* Animasi */}
      <style>
        {`
          @keyframes slideInUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slideInUp {
            animation: slideInUp 0.3s ease-out forwards;
          }
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
