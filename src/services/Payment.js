import axios from "axios";
import { API_URL } from "./Api";

export const Payment = {
  createTransaction: async ({
    pesanan_id,
    guest_id,
    items = [],
    total_harga = 0,
  }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/midtrans/create-transaction`,
        {
          pesanan_id,
          guest_id,
          items,
          total_harga,
        }
      );
      return res.data; 
    } catch (err) {
      console.error(
        "Gagal membuat transaksi Midtrans:",
        err.response?.data || err.message
      );
      throw err;
    }
  },

  getPesananDetail: async (pesanan_id) => {
    try {
      const res = await axios.get(`${API_URL}/api/pesanan/${pesanan_id}`);
      return res.data;
    } catch (err) {
      console.error(
        "Gagal ambil detail pesanan:",
        err.response?.data || err.message
      );
      return null;
    }
  },
};
