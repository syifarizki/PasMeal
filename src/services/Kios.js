import axios from "axios";
import { API_URL } from "./Api";

export const Kios = {
  getAll: async (searchTerm = "") => {
    try {
      const url = searchTerm
        ? `${API_URL}/api/kios/search?query=${searchTerm}`
        : `${API_URL}/api/kios`;

      const res = await axios.get(url);
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

  getMenusByKios: async (kiosId, searchTerm = "") => {
    try {
      const url = searchTerm
        ? `${API_URL}/api/kios/${kiosId}/menus/search?query=${searchTerm}`
        : `${API_URL}/api/kios/${kiosId}/menus`;
      const res = await axios.get(url);
      return res.data || [];
    } catch (err) {
      console.error("Gagal ambil menu kios:", err);
      return [];
    }
  },

  getById: async (kiosId) => {
    try {
      const res = await axios.get(`${API_URL}/api/kios/${kiosId}`);
      return res.data.data || null;
    } catch (err) {
      console.error("Gagal ambil kios by id:", err);
      return null;
    }
  },
};
