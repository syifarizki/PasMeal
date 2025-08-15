import axios from "axios";
import { API_URL } from "./Api";

export const Kios = {
  // Ambil semua kios
  getAll: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/kios`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Gagal ambil kios:", err);
      return [];
    }
  },
};
