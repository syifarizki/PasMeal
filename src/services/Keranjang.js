// Keranjang.js
import axios from "axios";
import { API_URL } from "./Api";
import { getImageUrl } from "../../utils/imageHelper"; // path sesuai file-mu

export const Keranjang = {
  getKeranjang: async (guest_id) => {
    if (!guest_id) return { items: [], kios_id: null, total_harga: 0 };
    const res = await axios.get(`${API_URL}/api/keranjang`, {
      params: { guest_id },
      headers: { "x-buyer-id": guest_id },
    });

    const items = res.data.items.map((item) => ({
      ...item,
      image: getImageUrl(item.image),
    }));

    return { ...res.data, items };
  },

  addItem: async (guest_id, menu_id, jumlah = 1, catatan = "") => {
    const res = await axios.post(`${API_URL}/api/keranjang`, {
      guest_id,
      menu_id,
      jumlah,
      catatan,
    });

    const item = res.data.item;
    item.image = getImageUrl(item.image);
    return item;
  },

  updateItem: async (guest_id, id, jumlah, catatan = "") => {
    const res = await axios.put(`${API_URL}/api/keranjang/${id}`, {
      guest_id,
      jumlah,
      catatan,
    });

    const item = res.data.item;
    item.image = getImageUrl(item.image);
    return item;
  },

  removeItem: async (guest_id, id) => {
    await axios.delete(`${API_URL}/api/keranjang/${id}`, {
      data: { guest_id },
    });
    return true;
  },
};
