import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  buatPesanan: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/pesanan`, data);
      return res.data; 
    } catch (err) {
      console.error("Gagal buat pesanan:", err.response?.data || err);
      throw err;
    }
  },

};
