import axios from "axios";
import { API_URL } from "./Api";

export const Kios = {
  getAll: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/kios`);
      return res.data || [];
    } catch (err) {
      console.error("Gagal ambil kios:", err);
      return [];
    }
  },

  getHomepage: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/kios/homepage`);
      return res.data || [];
    } catch (err) {
      console.error("Gagal ambil kios homepage:", err);
      return [];
    }
  },
};
