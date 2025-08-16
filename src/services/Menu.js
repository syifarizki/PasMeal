import axios from "axios";
import { API_URL } from "./Api";

export const Menu = {
  getNewMenus: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/menu/new`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Gagal ambil menu baru:", err);
      return [];
    }
  },

  getMenuById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/menu/${id}`);
      const data = res.data;
      return {
        id: parseInt(id),
        name: data.nama_menu,
        description: data.deskripsi,
        price: data.harga,
        image: data.foto_menu
          ? `${API_URL}/uploads/${data.foto_menu}`
          : "/images/menudefault.jpg",
        estimasiMenit: data.estimasi_menit || 0,
        statusTersedia:
          data.status_tersedia !== undefined ? data.status_tersedia : true,
      };
    } catch (err) {
      console.error(`Gagal ambil detail menu ID ${id}:`, err);
      return null;
    }
  },
};
