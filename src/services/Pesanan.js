import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  buatPesanan: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/pesanan`, data);
      return res.data?.pesanan || res.data;
    } catch (err) {
      console.error("Gagal buat pesanan:", err.response?.data || err.message);
      throw err;
    }
  },

  getDetailPesanan: async (pesananId) => {
    try {
      const res = await axios.get(`${API_URL}/api/pesanan/${pesananId}`);
      // backend kirim { ...pesanan, items: [...] }
      return res.data;
    } catch (err) {
      console.error(
        "Gagal ambil detail pesanan:",
        err.response?.data || err.message
      );
      throw err;
    }
  },
};
