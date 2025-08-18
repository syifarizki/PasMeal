import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { RiTimerLine } from "react-icons/ri";
import { BiStore } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import { Pesanan } from "../services/Pesanan";
import { Kios } from "../services/Kios";
import Timer from "../components/Timer";
import PrimaryButton from "../components/PrimaryButton";

export default function TimeEstimatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("processing");
  const [progress, setProgress] = useState(0);

  const formatRupiah = (value) =>
    "Rp" +
    Number(value || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  useEffect(() => {
    const fetchPesanan = async () => {
      const pesananId = location.state?.pesananId;
      if (!pesananId) {
        setLoading(false);
        return;
      }

      try {
        const detailPesanan = await Pesanan.getDetailPesanan(pesananId);
        if (detailPesanan && detailPesanan.kios_id) {
          const detailKios = await Kios.getById(detailPesanan.kios_id);
          const pesananLengkap = {
            ...detailPesanan,
            kios: detailKios,
          };
          setPesanan(pesananLengkap);
          const status =
            pesananLengkap.status === "done" ? "completed" : "processing";
          setOrderStatus(status);
          if (status === "completed") {
            setProgress(100);
          }
        } else {
          setPesanan(detailPesanan);
          const status =
            detailPesanan.status === "done" ? "completed" : "processing";
          setOrderStatus(status);
          if (status === "completed") {
            setProgress(100);
          }
        }
      } catch (err) {
        console.error("Gagal fetch pesanan atau detail kios:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.pesananId) {
      fetchPesanan();
    } else {
      setLoading(false);
    }
  }, [location.state]);

  const handlePesanLagi = () => {
    navigate("/");
  };

  const handleTimerFinish = () => {
    setOrderStatus("completed");
    setProgress(100);
  };

  const handleProgressUpdate = (newProgress) => {
    setProgress(newProgress);
  };

  if (loading) return <div className="p-6 text-center">Memuat pesanan...</div>;
  if (!pesanan)
    return <div className="p-6 text-center">Pesanan tidak ditemukan</div>;

  const items = pesanan.items || [];
  const totalQty = items.reduce((sum, item) => sum + (item.jumlah || 1), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.harga || 0) * (item.jumlah || 1),
    0
  );

  const isOrderCompleted = orderStatus === "completed";

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

      {/* Progress Pesanan */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 mt-4 md:mt-6 md:px-8 lg:px-20">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                isOrderCompleted
                  ? "bg-primary border-primary text-white"
                  : "bg-primary border-primary text-white"
              }`}
            >
              <FaArrowRotateLeft className="text-lg md:text-xl text-white" />
            </div>
            <span className="mt-2 text-sm md:text-base font-semibold text-primary">
              Pesanan Diproses
            </span>
          </div>

          <div className="flex-1 relative -mt-6">
            <div className="h-2 bg-gray-300 rounded-full w-full">
              <div
                className={`h-2 transition-all duration-500 rounded-full bg-primary`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                isOrderCompleted
                  ? "bg-primary border-primary"
                  : "bg-black border-black"
              }`}
            >
              <IoBagCheck className="text-lg md:text-xl text-white" />
            </div>
            <span
              className={`mt-2 text-sm md:text-base font-semibold ${
                isOrderCompleted ? "text-primary" : "text-black"
              }`}
            >
              Pesanan Selesai
            </span>
          </div>
        </div>

        <div className="w-full h-0.5 bg-primary mt-4"></div>
      </div>

      {/* Ringkasan Pesanan */}
      <div className="px-6 py-8 lg:flex lg:items-start lg:px-12 lg:gap-12">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="font-bold text-xl mb-4 lg:-mt-2">Ringkasan Pesanan</h2>

          <div className="flex justify-between items-center mb-4">
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm md:text-base font-medium">
              {pesanan.tipe_pengantaran === "diantar"
                ? "Diantar"
                : "Ambil Sendiri"}
            </button>
            <div className="bg-primary text-white px-4 py-2 rounded-full text-sm md:text-base font-medium flex items-center gap-1">
              <RiTimerLine className="w-5 h-6" />
              {isOrderCompleted ? (
                <span className="font-semibold">Selesai</span>
              ) : (
                <Timer
                  minutes={pesanan.total_estimasi || 10}
                  pesananId={pesanan.id}
                  onFinish={handleTimerFinish}
                  onProgress={handleProgressUpdate}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 font-medium p-2 border border-gray-200 rounded-lg w-full mb-4">
            <BiStore className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700">
              {pesanan.kios?.nama_kios || "Nama Kios tidak ditemukan"}
            </span>
          </div>

          <div className="border border-gray-200 rounded-md p-3 mb-4 w-full">
            <div className="mb-3 text-gray-700">
              <span className="font-medium">Pesanan:</span>
            </div>

            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id || item.menu_id}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.foto_menu || "/images/menudefault.jpg"}
                      alt={item.nama_menu}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <span className="font-bold text-base">
                      {item.nama_menu} x{item.jumlah}
                    </span>
                  </div>
                  <span className="text-primary font-semibold">
                    {formatRupiah(item.harga * item.jumlah)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 font-semibold">
                Pesanan kosong
              </div>
            )}
          </div>
        </div>
        {/* Form Data Pembe;i */}
        <div className="lg:w-1/2 mt-4 mb-10">
          <OrderForm
            deliveryType={pesanan.tipe_pengantaran}
            qty={totalQty}
            items={items}
            totalPrice={totalPrice}
            showPayButton={false}
            initialData={{
              nama: pesanan.nama_pemesan,
              noHp: pesanan.no_hp,
              catatan: pesanan.catatan,
              diantarKe: pesanan.diantar_ke,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] lg:w-[500px] ">
        <PrimaryButton
          text="Pesan Lagi"
          onClick={handlePesanLagi}
          disabled={!isOrderCompleted}
          className="w-full text-lg font-medium shadow-lg"
        />
      </div>
    </div>
  );
}
