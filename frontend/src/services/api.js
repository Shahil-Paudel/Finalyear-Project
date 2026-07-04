import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getRecommendations = (limit = 10) =>
  api.get(`recommendations/?limit=${limit}`).then((r) => r.data);

export const getContentRecommendations = (limit = 10) =>
  api.get(`recommendations/content/?limit=${limit}`).then((r) => r.data);

export const getProducts = (params = {}) =>
  api.get("products/", { params }).then((r) => r.data);

// merge-sort backed endpoint
export const getSortedProducts = (by = "price") =>
  api.get(`products/sorted/?by=${by}`).then((r) => r.data);

// binary-search backed endpoint
export const searchProducts = (name) =>
  api.get(`products/search/?name=${encodeURIComponent(name)}`).then((r) => r.data);

export const getCategories = () => api.get("categories/").then((r) => r.data);

export const logInteraction = (product_id, action) =>
  api.post("interactions/", { product: product_id, action });

export const placeOrder = (household, items) =>
  api.post("orders/", { household, items });

export const getProduct = (id) =>
    api.get(`products/${id}/`).then((r)=>r.data);

export const getHousehold = () =>
    api.get("households/me/").then((r)=>r.data);

export default api;
