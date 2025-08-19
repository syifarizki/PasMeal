import axios from "axios";
import { API_URL } from "./Api";

export const Payment = {

  buatTransaksiMidtrans: async (payload) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/midtrans/create-transaction`,
        payload
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
};
