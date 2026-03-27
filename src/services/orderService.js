import API from "./api";

export const getOrders = async (id) => {
  const res = await API.get("/orders");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await API.put(`/orders/${id}`, data);
  return res.data;
};

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};