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
  items,
  totalPrice,
  showPayButton = true,
  initialData = {},
}) {
  const [nama, setNama] = useState(initialData.nama || "");
  const [noHp, setNoHp] = useState(initialData.noHp || "");
  const [catatan, setCatatan] = useState(initialData.catatan || "");
  const [diantarKe, setDiantarKe] = useState(initialData.diantarKe || "");
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

  useEffect(() => {
    setNama(initialData.nama || "");
    setNoHp(initialData.noHp || "");
    setCatatan(initialData.catatan || "");
    setDiantarKe(initialData.diantarKe || "");
  }, [initialData]);

  const isFormValid =
    qty > 0 &&
    nama.trim() &&
    noHp.trim() &&
    (deliveryType !== "pesanAntar" || diantarKe.trim());

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
    if (!isFormValid)
      return showNotification(
        "Form Belum Lengkap",
        "Lengkapi semua data sebelum lanjut.",
        errorIcon
      );
    if (!items?.length)
      return showNotification(
        "Keranjang Kosong",
        "Tambahkan menu sebelum melanjutkan.",
        errorIcon
      );

    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest-" + Date.now();
      localStorage.setItem("guestId", guestId);
    }

    const payloadPesanan = {
      guest_id: guestId,
      tipe_pengantaran: deliveryType,
      nama_pemesan: nama,
      no_hp: noHp,
      catatan: catatan || "-",
      diantar_ke: deliveryType === "pesanAntar" ? diantarKe : null,
      items: items.map((i) => ({ menu_id: i.id, qty: i.qty, harga: i.price })),
      total_harga: totalPrice,
    };

    try {
      setLoading(true);

      const pesananRes = await Pesanan.buatPesanan(payloadPesanan);
      const pesanan_id = pesananRes?.id;
      if (!pesanan_id) throw new Error("Pesanan gagal dibuat");

      const pesananDetail = await Payment.getPesananDetail(pesanan_id);
      const namaKios = pesananDetail?.kios?.nama_kios || "Kios";
      const namaPemesan = pesananDetail?.nama_pemesan || nama;

      const transaksiRes = await Payment.createTransaction({
        pesanan_id,
        guest_id: guestId,
        items: payloadPesanan.items.map((i) => ({
          id: i.menu_id,
          price: i.harga,
          quantity: i.qty,
          name: items.find((x) => x.id === i.menu_id)?.name || "Menu",
        })),
        total_harga: totalPrice,
      });
      if (!transaksiRes?.token) throw new Error("Token Snap tidak ditemukan");

      window.snap.pay(transaksiRes.token, {
        onSuccess: () => {
          showNotification(
            "Yey!",
            "Pembayaran berhasil!",
            successIcon,
            "Oke",
            () =>
              navigate("/TimeEstimatePage", {
                state: {
                  pesananId: pesanan_id,
                  namaKios,
                  namaPemesan,
                },
              })
          );
        },
        onPending: () => {
          showNotification(
            "Menunggu",
            "Pembayaran menunggu konfirmasi.",
            pendingIcon
          );
        },
        onError: () => {
          showNotification("Gagal", "Pembayaran gagal.", errorIcon);
        },
        onClose: () => {
          showNotification(
            "Dibatalkan",
            "Kamu menutup popup sebelum bayar.",
            errorIcon
          );
        },
      });
    } catch (err) {
      console.error("Error Snap:", err);
      showNotification(
        "Error",
        err.message || "Terjadi kesalahan, coba lagi.",
        errorIcon
      );
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
        {deliveryType === "pesanAntar" && (
          <InputText
            label="Diantar Ke?"
            value={diantarKe}
            onChange={(e) => setDiantarKe(e.target.value)}
            placeholder="Masukkan alamat lengkap"
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
