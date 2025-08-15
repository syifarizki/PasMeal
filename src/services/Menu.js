import axios from "axios";
import { API_URL } from "./Api";

export const Menu = {
  getNewMenus: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/menu/new`);
      // res.data sudah array dari backend
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Gagal ambil menu baru:", err);
      return [];
    }
  },
};
