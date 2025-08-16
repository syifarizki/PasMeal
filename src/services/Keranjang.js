// src/services/Keranjang.js
import axios from "axios";
import { API_URL } from "./Api";

export const Keranjang = {
  getKeranjang: async (guestId) => {
    if (!guestId) return [];
    try {
      const res = await axios.get(`${API_URL}/api/keranjang`, {
        headers: { "x-buyer-id": guestId },
      });
      return res.data.items || []; // backend return { items: [...] }
    } catch (err) {
      console.error(
        "Gagal ambil data keranjang:",
        err.message,
        err.response?.data
      );
      return [];
    }
  },

  addItem: async (guestId, menu_id, jumlah = 1, catatan = "") => {
    if (!guestId || !menu_id) return null;
    try {
      const res = await axios.post(
        `${API_URL}/api/keranjang`,
        { menu_id, jumlah, catatan },
        { headers: { "x-buyer-id": guestId } }
      );
      return res.data.item; // backend return { item: {...} }
    } catch (err) {
      console.error(
        "Gagal tambah item ke keranjang:",
        err.message,
        err.response?.data
      );
      return null;
    }
  },

  updateItem: async (guestId, id, jumlah, catatan = null) => {
    if (!guestId || !id) return null;
    try {
      const res = await axios.put(
        `${API_URL}/api/keranjang/${id}`,
        { jumlah, catatan },
        { headers: { "x-buyer-id": guestId } }
      );
      return res.data.item;
    } catch (err) {
      console.error(
        "Gagal update item di keranjang:",
        err.message,
        err.response?.data
      );
      return null;
    }
  },

  removeItem: async (guestId, id) => {
    if (!guestId || !id) return null;
    try {
      const res = await axios.delete(`${API_URL}/api/keranjang/${id}`, {
        headers: { "x-buyer-id": guestId },
      });
      return res.data.item;
    } catch (err) {
      console.error(
        "Gagal hapus item dari keranjang:",
        err.message,
        err.response?.data
      );
      return null;
    }
  },
};
