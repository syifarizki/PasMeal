// TimeEstimatePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { RiTimerLine } from "react-icons/ri";
import { BiStore } from "react-icons/bi";
import { MdOutlineAssignment } from "react-icons/md";
import OrderForm from "../components/OrderForm";
import { Pesanan } from "../services/Pesanan";
import { Kios } from "../services/Kios";
import Timer from "../components/Timer";
import PrimaryButton from "../components/PrimaryButton";
import { getImageUrl } from "../../utils/imageHelper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function TimeEstimatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("processing");
  const [progress, setProgress] = useState(0);
  const [guestId, setGuestId] = useState(null);

  const [totalDuration, setTotalDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Cek guest_id
  useEffect(() => {
    const storedGuestId = localStorage.getItem("guest_id");
    if (storedGuestId) {
      setGuestId(storedGuestId);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);

  const handleOrderCompletion = useCallback(() => {
    if (orderStatus === "completed") return;
    setOrderStatus("completed");
    setProgress(100);
    setTotalDuration(0);
  }, [orderStatus]);

  const fetchPesanan = useCallback(async () => {
    if (!guestId) return;
    try {
      const pesananId =
        location.state?.pesananId || localStorage.getItem("last_pesanan_id");
      if (!pesananId) {
        setLoading(false);
        navigate("/");
        return;
      }

      localStorage.setItem("last_pesanan_id", pesananId);

      const detailPesanan = await Pesanan.getPesananDetail(pesananId, guestId);
      if (!detailPesanan) throw new Error("Detail pesanan tidak ditemukan.");

      if (detailPesanan.kios_id) {
        const detailKios = await Kios.getById(detailPesanan.kios_id);
        detailPesanan.kios = detailKios;
      }

      // generate URL gambar lengkap untuk setiap item
if (detailPesanan.items) {
  detailPesanan.items = detailPesanan.items.map((item) => ({
    ...item,
    imageUrl: getImageUrl(item.foto_menu), // gunakan helper
  }));
}



      setPesanan(detailPesanan);

      if (detailPesanan.status === "done") {
        handleOrderCompletion();
      } else {
        setOrderStatus("processing");
        setStartTime(detailPesanan.created_at);

        const totalWaktuAntreanMenit = (detailPesanan.antrean || []).reduce(
          (sum, item) => sum + (item.sisaWaktu || 0),
          0
        );

        const totalEstimasiMenit =
          (detailPesanan.total_estimasi || 0) + totalWaktuAntreanMenit;

        setTotalDuration(Math.max(0, Math.ceil(totalEstimasiMenit * 60)));
      }
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
      setPesanan(null);
    } finally {
      setLoading(false);
    }
  }, [guestId, location.state, handleOrderCompletion, navigate]);

  useEffect(() => {
    if (guestId) fetchPesanan();
  }, [guestId, fetchPesanan]);

  useEffect(() => {
    if (orderStatus === "processing" && guestId) {
      const intervalId = setInterval(fetchPesanan, 10000);
      return () => clearInterval(intervalId);
    }
  }, [orderStatus, guestId, fetchPesanan]);

  useEffect(() => {
    if (orderStatus === "completed") {
      const autoClearTimer = setTimeout(() => {
        localStorage.removeItem("guest_id");
        localStorage.removeItem("last_pesanan_id");
        navigate("/");
      }, 10 * 60 * 1000);
      return () => clearTimeout(autoClearTimer);
    }
  }, [orderStatus, navigate]);

  const handlePesanLagi = () => {
    localStorage.removeItem("guest_id");
    localStorage.removeItem("last_pesanan_id");
    navigate("/");
  };

  if (loading) return <div className="p-6 text-center">Memuat pesanan...</div>;
  if (!pesanan)
    return (
      <div className="p-6 text-center">
        <p className="text-xl font-semibold mb-4">Gagal Memuat Pesanan</p>
        <p className="text-gray-600 mb-6">
          Pesanan tidak ditemukan atau Anda tidak memiliki akses.
        </p>
        <PrimaryButton
          text="Kembali ke Beranda"
          onClick={() => navigate("/")}
        />
      </div>
    );

  const items = pesanan.items || [];
  const totalQty = items.reduce((sum, item) => sum + (item.jumlah || 1), 0);
  const isOrderCompleted = orderStatus === "completed";

  const progressLine1 = Math.min(100, progress * 2);
  const progressLine2 = Math.max(0, (progress - 50) * 2);

  return (
    <div className="bg-white">
      {/* Header */}
      <header
        className="p-6 text-white font-bold text-lg flex items-center justify-center md:justify-start"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-xl lg:text-2xl">Status Pesananmu</h1>
      </header>

      {/* Progress */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center max-w-2xl md:max-w-3xl mx-auto px-4 py-6 w-full">
          <div className="flex flex-col items-center text-center w-36">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 bg-primary border-primary text-white">
              <MdOutlineAssignment className="text-lg md:text-xl" />
            </div>
            <span className="mt-2 text-xs md:text-sm font-semibold text-primary">
              Menunggu Diproses
            </span>
          </div>
          <div className="flex-1 h-1.5 mx-2 rounded-full bg-gray-200">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressLine1}%` }}
            ></div>
          </div>
          <div className="flex flex-col items-center text-center w-36">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                progress > 0 || isOrderCompleted
                  ? "bg-primary border-primary text-white"
                  : "bg-gray-200 border-gray-200 text-gray-500"
              }`}
            >
              <FaArrowRotateLeft className="text-lg md:text-xl" />
            </div>
            <span
              className={`mt-2 text-xs md:text-sm font-semibold transition-colors duration-500 ${
                progress > 0 || isOrderCompleted
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              Sedang Diproses
            </span>
          </div>
          <div className="flex-1 h-1.5 mx-2 rounded-full bg-gray-200">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressLine2}%` }}
            ></div>
          </div>
          <div className="flex flex-col items-center text-center w-36">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                isOrderCompleted
                  ? "bg-primary border-primary text-white"
                  : "bg-gray-200 border-gray-200 text-gray-500"
              }`}
            >
              <IoBagCheck className="text-lg md:text-xl" />
            </div>
            <span
              className={`mt-2 text-xs md:text-sm font-semibold transition-colors duration-500 ${
                isOrderCompleted ? "text-primary" : "text-gray-500"
              }`}
            >
              Pesanan Selesai
            </span>
          </div>
        </div>
        <div className="w-full h-0.5 bg-primary"></div>
      </div>

      {/* Order Details */}
      <div className="px-6 py-8 lg:flex lg:items-start lg:px-12 lg:gap-12">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="font-bold text-xl mb-4 lg:-mt-2">Ringkasan Pesanan</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="bg-primary text-white px-4 py-2 rounded-full text-sm md:text-base font-medium">
              {pesanan.tipe_pengantaran === "diantar"
                ? "Pesan Antar"
                : "Ambil Sendiri"}
            </div>
            <div className="bg-primary text-white px-4 py-2 rounded-full text-sm md:text-base font-medium flex items-center gap-1">
              <RiTimerLine className="w-5 h-6" />
              {isOrderCompleted ? (
                <span className="font-semibold">Selesai</span>
              ) : (
                <Timer
                  durationInSeconds={totalDuration}
                  startTime={startTime}
                  onFinish={handleOrderCompletion}
                  onProgress={setProgress}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 font-medium p-2 border border-gray-200 rounded-lg w-full mb-4">
            <BiStore className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 uppercase">
              {pesanan.kios?.nama_kios || "Nama Kios"}
            </span>
          </div>

          <div className="border border-gray-200 rounded-md p-3 mb-10 w-full">
            <div className="mb-3 text-black">
              <span className="font-medium">Pesanan:</span>
            </div>
            {items.map((item) => (
              <div
                key={item.id || item.menu_id}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-3">
                  <LazyLoadImage
                    src={item.imageUrl} // jangan pakai langsung item.foto_menu
                    alt={item.nama_menu || "Menu"}
                    className="w-16 h-16 object-cover rounded"
                    effect="blur"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/menudefault.jpg";
                    }}
                  />

                  <span className="font-bold text-base">
                    {item.nama_menu || "Menu"} x{item.jumlah || 1}
                  </span>
                </div>
                <span className="text-primary font-medium">
                  {formatRupiah((item.harga || 0) * (item.jumlah || 1))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 mt-4 mb-10">
          <OrderForm
            deliveryType={pesanan.tipe_pengantaran}
            qty={totalQty}
            showPayButton={false}
            initialData={{
              nama_pemesan: pesanan.nama_pemesan || "",
              no_hp: pesanan.no_hp || "",
              catatan: pesanan.catatan || "",
              diantar_ke:
                pesanan.tipe_pengantaran === "diantar"
                  ? "Pesan Antar"
                  : "Ambil Sendiri",
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-24 lg:pb-4">
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] lg:w-[500px]">
          <PrimaryButton
            text="Pesan Lagi"
            onClick={handlePesanLagi}
            disabled={!isOrderCompleted}
            className="w-full text-lg font-medium shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
