import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "./QuantityControl";
import PrimaryButton from "./PrimaryButton";
import { useCart } from "../context/CartContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Cart({ onClose }) {
  const { cart, updateQty, removeItem, guest_id } = useCart();
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  const total = Object.values(cart).reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.qty ?? 0),
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/OrderConfirmationPage");
  };

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!guest_id) return null;

  return (
    <div className="fixed inset-0 z-60 flex lg:justify-end">
      <div className="flex-1 bg-black/50" onClick={onClose}></div>

      <div
        className={`bg-white shadow-lg flex flex-col max-h-screen ${
          isDesktop
            ? "lg:fixed lg:top-0 lg:right-0 lg:bottom-0 lg:w-[400px] lg:rounded-l-2xl animate-slideInRight"
            : "w-full fixed bottom-0 rounded-t-2xl animate-slideInUp"
        }`}
      >
        <div className="relative flex items-center justify-center px-4 py-4 border-b">
          <h2 className="font-bold text-lg">Keranjang Saya</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white bg-orange-500 rounded-full p-1 cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 mb-3">
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-500">Keranjang kosong</p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(cart).map(([menuId, item]) => (
                <li key={menuId} className="flex items-center gap-3">
                  <LazyLoadImage
                    src={item.image || "/images/menudefault.jpg"}
                    alt={item.name || "Menu"}
                    effect="blur"
                    placeholderSrc="/images/menudefault.jpg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/menudefault.jpg";
                    }}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name || "Menu"}</p>
                    <p className="text-orange-500 text-sm">
                      Rp {(item.price ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <QuantityControl
                    qty={item.qty}
                    setQty={(newQty) => {
                      if (newQty <= 0) removeItem(menuId);
                      else updateQty(menuId, newQty);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

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

      <style>{`
        @keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
