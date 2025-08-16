import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import QuantityControl from "../components/QuantityControl";
import { Keranjang } from "../services/Keranjang";
import { Kios } from "../services/Kios";

export default function OrderConfirmation() {
  const [deliveryType, setDeliveryType] = useState("pesanAntar");
  const [cart, setCart] = useState({});
  const [kiosName, setKiosName] = useState("");
  const [kiosId, setKiosId] = useState(null); // ✅ simpan kiosId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatRupiah = (value) => value.toLocaleString("id-ID");

  const items = Object.values(cart);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const guestId = localStorage.getItem("guestId");
        if (!guestId) throw new Error("Guest ID tidak ditemukan");

        const res = await Keranjang.getKeranjang(guestId);

        if (res?.length > 0) {
          const mapped = {};
          res.forEach((item) => {
            mapped[item.id] = {
              id: item.id,
              name: item.nama_menu,
              price: item.harga,
              qty: item.jumlah,
              image:
                item.menu?.foto_url ??
                (item.foto_menu
                  ? `${import.meta.env.VITE_API_URL}/uploads/${item.foto_menu}`
                  : "/images/menudefault.jpg"),
              menuId: item.menu_id,
              subtotal: item.subtotal,
              kiosId: item.kios_id,
            };
          });
          setCart(mapped);

          const firstItem = Object.values(mapped)[0];
          if (firstItem) {
            const kiosRes = await Kios.getById(firstItem.kiosId);
            setKiosId(firstItem.kiosId); // ✅ simpan kiosId
            setKiosName(kiosRes?.nama_kios || "Nama Kios");
          } else {
            setKiosName("Nama Kios");
          }
        } else {
          setCart({});
          setKiosName("Nama Kios");
        }
      } catch (err) {
        console.error("Gagal ambil keranjang:", err);
        setError("Gagal memuat keranjang");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQty = async (id, newQty) => {
    try {
      const guestId = localStorage.getItem("guestId");
      await Keranjang.updateItem(guestId, id, newQty);

      setCart((prev) => {
        const updated = { ...prev };
        if (newQty <= 0) delete updated[id];
        else updated[id] = { ...updated[id], qty: newQty };
        return updated;
      });
    } catch (err) {
      console.error("Gagal update keranjang:", err);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Memuat keranjang...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white font-sans">
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

      {/* Delivery Type Selector */}
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
        {/* Order Summary */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="font-bold text-xl mb-4 lg:-mt-2">Ringkasan Pesanan</h2>

          <div className="border border-gray-200 rounded-md p-3 mb-4">
            {/* Nama Toko */}
            <div className="flex justify-between items-center mb-3 text-gray-700">
              <div className="flex items-center gap-2 font-medium">
                <BiStore className="w-6 h-6" />
                <span>{kiosName}</span>
              </div>
              <button
                className="text-primary text-base cursor-pointer"
                type="button"
                disabled={!kiosId} // ✅ cegah error kalau kiosId null
                onClick={() => navigate(`/MenuPage/${kiosId}`)}
              >
                Tambah Menu
              </button>
            </div>

            {/* Items */}
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-base lg:text-lg">
                      {item.name}
                    </h3>
                    <p className="text-primary font-semibold">
                      Rp. {formatRupiah(item.price)}
                    </p>
                  </div>
                  <QuantityControl
                    qty={item.qty}
                    setQty={(newQty) => updateQty(item.id, newQty)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 font-semibold">
                Pesanan kosong
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border border-gray-300 rounded-md p-3 text-lg flex justify-between items-center">
            <span className="font-bold">Total {totalQty} Menu:</span>
            <span className="text-primary">Rp. {formatRupiah(totalPrice)}</span>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:w-1/2">
          <OrderForm
            deliveryType={deliveryType}
            qty={totalQty}
            items={items}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
