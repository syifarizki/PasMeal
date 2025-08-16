import React, { useState } from "react";
import InputText from "./Input/InputText";
import InputPhone from "./Input/InputPhone";
import TextArea from "./Input/TextArea";
import PrimaryButton from "./PrimaryButton";
import { Pesanan } from "../services/Pesanan";

export default function OrderForm({ deliveryType, qty, items, totalPrice }) {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [catatan, setCatatan] = useState("");
  const [diantarKe, setDiantarKe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // simpan / ambil guest_id dari localStorage
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = "guest-" + Date.now();
      localStorage.setItem("guest_id", guestId);
    }

    // payload sesuai BE
    const payload = {
      guest_id: guestId,
      tipe_pengantaran: deliveryType, // pastikan value: "ditempat" | "ambilSendiri" | "pesanAntar"
      nama_pemesan: nama,
      no_hp: noHp,
      catatan,
      diantar_ke: deliveryType === "pesanAntar" ? diantarKe : null,
      items: items.map((item) => ({
        menu_id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      total_harga: totalPrice,
    };

    try {
      setLoading(true);
      const res = await Pesanan.buatPesanan(payload);
      console.log("Pesanan berhasil dibuat:", res);

      // 🔹 Jika backend balikin snapToken → jalankan Midtrans Snap
      if (res?.snapToken && window.snap) {
        window.snap.pay(res.snapToken, {
          onSuccess: (result) => {
            console.log("Pembayaran sukses:", result);
            alert("Pembayaran berhasil!");
          },
          onPending: (result) => {
            console.log("Menunggu pembayaran:", result);
            alert("Menunggu pembayaran...");
          },
          onError: (result) => {
            console.error("Pembayaran gagal:", result);
            alert("Pembayaran gagal!");
          },
          onClose: () => {
            console.log("Popup pembayaran ditutup");
            alert("Kamu menutup popup sebelum bayar.");
          },
        });
      } else {
        alert("Pesanan berhasil dibuat! Order ID: " + res?.pesanan?.id);
      }
    } catch (error) {
      console.error("Gagal buat pesanan:", error);
      alert("Gagal membuat pesanan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    qty > 0 &&
    nama.trim() &&
    noHp.trim() &&
    catatan.trim() &&
    (deliveryType !== "pesanAntar" || diantarKe.trim());

  return (
    <form onSubmit={handleSubmit} className="md:flex-1 flex flex-col gap-4">
      <InputText
        type="text"
        label="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Nama"
      />

      <InputPhone
        label="Nomor WhatsApp"
        value={noHp}
        onChange={setNoHp}
        placeholder="Nomor WhatsApp"
      />

      <TextArea
        label="Catatan Tambahan"
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder="Catatan Tambahan"
        rows={2}
      />

      {deliveryType === "pesanAntar" && (
        <InputText
          type="text"
          label="Diantar Ke?"
          value={diantarKe}
          onChange={(e) => setDiantarKe(e.target.value)}
          placeholder="Diantar Ke?"
        />
      )}

      <div className="mt-3">
        <PrimaryButton
          type="submit"
          text={loading ? "Memproses..." : "Bayar"}
          className="w-full py-2"
          disabled={!isFormValid || loading}
        />
      </div>
    </form>
  );
}
