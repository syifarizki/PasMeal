import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  //  Membuat pesanan di database berdasarkan keranjang.
  buatPesanan: async (payload) => {
    try {
      const res = await axios.post(`${API_URL}/api/pesanan`, payload);
      return res.data;
    } catch (err) {
      console.error(
        "Gagal membuat pesanan:",
        err.response?.data || err.message
      );
      throw err;
    }
  },

  //  Mengambil detail lengkap dari sebuah pesanan untuk halaman status.
  getPesananDetail: async (pesanan_id, guest_id) => {
    try {
      if (!guest_id)
        throw new Error("Guest ID wajib untuk mengambil detail pesanan.");
      const res = await axios.get(
        `${API_URL}/api/pesanan/${pesanan_id}?guest_id=${guest_id}`
      );
      return res.data;
    } catch (err) {
      console.error(
        "Gagal ambil detail pesanan:",
        err.response?.data || err.message
      );
      throw err;
    }
  },

  getStatusPesananGuest: async (pesanan_id, guest_id) => {
    try {
      if (!guest_id)
        throw new Error("Guest ID wajib untuk mengambil status pesanan.");
      // Pastikan route ini sesuai dengan yang Anda definisikan di backend
      const res = await axios.get(
        `${API_URL}/api/pesanan/${pesanan_id}/status?guest_id=${guest_id}`
      );
      return res.data;
    } catch (err) {
      console.error(
        "Gagal ambil status pesanan:",
        err.response?.data || err.message
      );
      throw err;
    }
  },
};
