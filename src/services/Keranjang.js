import axios from "axios";
import { API_URL } from "./Api";

export const Keranjang = {
  getKeranjang: async (guest_id) => {
    if (!guest_id) return [];
    try {
      const res = await axios.get(`${API_URL}/api/keranjang`, {
        headers: { "x-buyer-id": guest_id },
      });
      return res.data.items || [];
    } catch (err) {
      console.error(
        "Gagal ambil data keranjang:",
        err.message,
        err.response?.data
      );
      return [];
    }
  },

  addItem: async (guest_id, menu_id, jumlah = 1, catatan = "") => {
    try {
      const res = await axios.post(
        `${API_URL}/api/keranjang`,
        { menu_id, jumlah, catatan },
        { headers: { "x-buyer-id": guest_id } }
      );
      return res.data.item;
    } catch (err) {
      console.error(
        "Gagal tambah item ke keranjang:",
        err.message,
        err.response?.data
      );
      return null;
    }
  },

  updateItem: async (guest_id, id, jumlah, catatan = "") => {
    try {
      const res = await axios.put(
        `${API_URL}/api/keranjang/${id}`,
        { jumlah, catatan },
        { headers: { "x-buyer-id": guest_id } }
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

  removeItem: async (guest_id, id) => {
    try {
      const res = await axios.delete(`${API_URL}/api/keranjang/${id}`, {
        headers: { "x-buyer-id": guest_id },
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

