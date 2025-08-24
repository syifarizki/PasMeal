const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (path) => {
  if (!path) return "/images/menudefault.jpg";
  return path.startsWith("http") ? path : `${API_URL}/${path}`;
};
