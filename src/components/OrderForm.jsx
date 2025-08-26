import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "./Input/InputText";
import InputPhone from "./Input/InputPhone";
import TextArea from "./Input/TextArea";
import PrimaryButton from "./PrimaryButton";
import { Pesanan } from "../services/Pesanan";
import { Payment } from "../services/Payment";
import Notification from "../components/Notification";
import successIcon from "/images/berhasil.png";
import errorIcon from "/images/gagal.png";
import pendingIcon from "/images/pending.png";

export default function OrderForm({
  deliveryType,
  qty,
  kiosId,
  totalPrice,
  items = [],
  showPayButton = true,
  initialData = {},
}) {
  const [nama, setNama] = useState(initialData.nama_pemesan || "");
  const [noHp, setNoHp] = useState(initialData.no_hp || "");
  const [catatan, setCatatan] = useState(initialData.catatan || "");
  const [diantarKe, setDiantarKe] = useState(initialData.diantar_ke || "");
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [notif, setNotif] = useState({
    show: false,
    title: "",
    message: "",
    buttonText: "Tutup",
    iconImage: null,
    onConfirm: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (window.snap) return setSnapReady(true);
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL;
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    script.async = true;
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
  }, []);

  const isFormValid =
    qty > 0 &&
    nama.trim() &&
    noHp.trim() &&
    catatan.trim() &&
    (deliveryType !== "diantar" || diantarKe.trim()) &&
    items.length > 0; 

  const showNotification = (
    title,
    message,
    iconImage,
    buttonText = "Oke",
    onConfirm = null
  ) => {
    setNotif({ show: true, title, message, iconImage, buttonText, onConfirm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);

      // Buat payload pesanan lengkap
      const payloadPesanan = {
        guest_id: localStorage.getItem("guest_id"),
        tipe_pengantaran: deliveryType,
        nama_pemesan: nama.trim(),
        no_hp: noHp.trim(),
        catatan,
        diantar_ke: deliveryType === "diantar" ? diantarKe.trim() : null,
        kios_id: kiosId,
        total_harga: totalPrice,
        items: items.map((item) => ({
          menu_id: Number(item.id),
          jumlah: Number(item.qty),
        })),
      };

      console.log("Payload pesanan:", payloadPesanan);

      const resPesanan = await Pesanan.buatPesanan(payloadPesanan);
      const newPesananId = resPesanan.pesanan?.id;

      if (!newPesananId) {
        throw new Error("Gagal mendapatkan ID Pesanan dari server.");
      }

      // Buat transaksi Midtrans
      const resTransaksi = await Payment.buatTransaksiMidtrans({
        pesanan_id: newPesananId,
        guest_id: localStorage.getItem("guest_id"),
        total_harga: totalPrice,
      });

      const snapToken = resTransaksi.token;

      if (!snapToken) {
        throw new Error("Gagal mendapatkan token pembayaran dari server.");
      }

      window.snap.pay(snapToken, {
        onSuccess: () => {
          showNotification(
            "Pembayaran Berhasil",
            "Pesananmu sudah diterima.",
            successIcon,
            "Lanjut",
            () =>
              navigate("/TimeEstimatePage", {
                state: { pesananId: newPesananId },
              })
          );
        },
        onPending: () =>
          showNotification(
            "Menunggu Pembayaran",
            "Selesaikan pembayaranmu.",
            pendingIcon
          ),
        onError: () =>
          showNotification(
            "Pembayaran Gagal",
            "Terjadi kesalahan pembayaran.",
            errorIcon
          ),
        onClose: () => console.log("Snap ditutup tanpa penyelesaian."),
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan, silakan coba lagi.";
      console.error("❌ Proses pemesanan gagal:", err);
      showNotification("Pemesanan Gagal", errorMessage, errorIcon);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="md:flex-1 flex flex-col gap-6">
        <InputText
          label="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama"
          readOnly={!showPayButton}
        />
        <InputPhone
          label="Nomor WhatsApp"
          value={noHp}
          onChange={setNoHp}
          placeholder="Nomor WhatsApp"
          readOnly={!showPayButton}
        />
        <TextArea
          label="Catatan Tambahan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Catatan Tambahan"
          rows={2}
          readOnly={!showPayButton}
        />
        {deliveryType === "diantar" && (
          <InputText
            label="Diantar Ke?"
            value={diantarKe}
            onChange={(e) => setDiantarKe(e.target.value)}
            placeholder="Masukkan nomor meja atau lokasi"
            readOnly={!showPayButton}
          />
        )}
        {showPayButton && (
          <PrimaryButton
            type="submit"
            text={loading ? "Memproses..." : "Bayar"}
            className="w-full py-2"
            disabled={!isFormValid || loading || !snapReady}
          />
        )}
      </form>
      <Notification
        show={notif.show}
        title={notif.title}
        message={notif.message}
        iconImage={notif.iconImage}
        buttonText={notif.buttonText}
        onClose={() => {
          setNotif({ ...notif, show: false });
          if (notif.onConfirm) notif.onConfirm();
        }}
      />
    </>
  );
}
