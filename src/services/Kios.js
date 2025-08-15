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

  getMenusByKios: async (kiosId) => {
    try {
      const res = await axios.get(`${API_URL}/api/kios/${kiosId}/menus`);
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
