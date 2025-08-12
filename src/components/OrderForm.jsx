import React, { useState } from "react";
import InputText from "./Input/InputText";
import InputPhone from "./Input/InputPhone";
import TextArea from "./Input/TextArea";
import PrimaryButton from "./PrimaryButton"; 

export default function OrderForm({ deliveryType, qty }) {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [catatan, setCatatan] = useState("");
  const [diantarKe, setDiantarKe] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // proses submit
  };

  // kondisi untuk enable tombol
  const isFormValid =
    qty > 0 && // harus ada pesanan
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
          text="Bayar"
          className="w-full py-2"
          onClick={handleSubmit}
          disabled={!isFormValid} // disable kalau form gak valid atau qty 0
        />
      </div>
    </form>
  );
}
