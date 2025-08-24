import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import QuantityControl from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { Kios } from "../services/Kios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function OrderConfirmation() {
  const [deliveryType, setDeliveryType] = useState("pesanAntar");
  const [kiosName, setKiosName] = useState("Memuat...");
  const [kiosId, setKiosId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { cart, updateQty, removeItem, fetchCart } = useCart();

  const formatRupiah = (value) => value.toLocaleString("id-ID");

  const items = Object.values(cart);
  const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  // Ambil cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        await fetchCart();
      } catch (err) {
        console.error("Gagal ambil keranjang:", err);
        setError("Gagal memuat keranjang. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  // Ambil kios
  useEffect(() => {
    const fetchKios = async () => {
      if (items.length > 0 && items[0].kiosId) {
        try {
          const kiosRes = await Kios.getById(items[0].kiosId);
          setKiosId(items[0].kiosId);
          setKiosName(kiosRes?.nama_kios || "Nama Kios Tidak Ditemukan");
        } catch (err) {
          console.error("Gagal ambil detail kios:", err);
          setKiosName("Nama Kios Tidak Ditemukan");
        }
      } else {
        setKiosName("Keranjang Kosong");
      }
    };
    fetchKios();
  }, [items]);

  if (loading)
    return <div className="p-6 text-center">Memuat keranjang...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const apiDeliveryType =
    deliveryType === "pesanAntar" ? "diantar" : "ambil_sendiri";

  return (
    <div className="bg-white">
      {/* Header */}
      <header
        className="p-6 text-white font-bold text-lg relative flex items-center justify-center lg:justify-start"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={() => window.history.back()}
          className="lg:hidden absolute left-4 flex items-center gap-1 text-white text-lg font-medium rounded-full p-2 bg-black/20 mt-1"
        >
          <FiArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <h1 className="font-bold text-xl lg:text-2xl">
          Konfirmasi Detail Pesanan
        </h1>
      </header>

      {/* Tipe Pengantaran */}
      <div className="flex border-b border-primary text-black font-semibold text-base lg:text-lg">
        {["pesanAntar", "ambilSendiri"].map((type) => (
          <button
            key={type}
            onClick={() => setDeliveryType(type)}
            className="flex-1 flex justify-center py-2 lg:py-3 bg-white cursor-pointer"
          >
            <span
              className={`px-8 py-1 rounded ${
                deliveryType === type ? "bg-primary text-white" : "text-black"
              }`}
            >
              {type === "pesanAntar" ? "Pesan Antar" : "Ambil Sendiri"}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 lg:flex lg:items-start lg:px-12 lg:gap-12">
        {/* Ringkasan Pesanan */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="font-bold text-xl mb-4 lg:-mt-2">Ringkasan Pesanan</h2>
          <div className="border border-gray-200 rounded-md p-3 mb-4">
            <div className="flex justify-between items-center mb-3 text-gray-700">
              <div className="flex items-center gap-2 font-medium">
                <BiStore className="w-6 h-6" />
                <span className="uppercase">{kiosName}</span>
              </div>
              <button
                className="text-primary text-base cursor-pointer"
                type="button"
                disabled={!kiosId}
                onClick={() => navigate(`/MenuPage/${kiosId}`)}
              >
                Tambah Menu
              </button>
            </div>

            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-3">
                  <LazyLoadImage
                    src={item.image} // gunakan image dari cart context, bukan foto_menu
                    alt={item.name || "Menu"}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/menudefault.jpg";
                    }}
                    effect="blur"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-black text-base lg:text-lg">
                      {item.name || "Menu"}
                    </h3>
                    <p className="text-primary font-semibold">
                      Rp. {formatRupiah(item.price || 0)}
                    </p>
                  </div>
                  <QuantityControl
                    qty={item.qty || 0}
                    setQty={(newQty) => {
                      if (newQty <= 0) {
                        removeItem(item.id);
                      } else {
                        updateQty(item.id, newQty);
                      }
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 font-semibold">
                Keranjang Anda kosong
              </div>
            )}
          </div>

          <div className="border border-gray-300 rounded-md p-3 text-lg flex justify-between items-center">
            <span className="font-bold">Total {totalQty} Menu:</span>
            <span className="text-primary font-semibold">
              Rp. {formatRupiah(totalPrice)}
            </span>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:w-1/2">
          <OrderForm
            deliveryType={apiDeliveryType}
            qty={totalQty}
            kiosId={kiosId}
            totalPrice={totalPrice}
            items={items}
          />
        </div>
      </div>
    </div>
  );
}
