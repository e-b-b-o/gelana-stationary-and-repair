import { api } from "../../lib/axios";

export async function getProducts() {
  const response = await api.get("/products");

  return response.data;
}

export async function getProduct(id) {
  const response = await api.get(`products/${id}`);

  return response.data;
}

export async function createProduct(data) {
  const response = await api.post("/products", data);

  return response.data;
}

export async function updateProduct(id, data) {
  const response = await api.patch(`/products/${id}`, data);

  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`products/${id}`);

  return response.data;
}
