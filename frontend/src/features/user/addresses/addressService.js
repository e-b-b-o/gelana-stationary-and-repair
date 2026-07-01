import { api } from "../../../lib/axios.js";

// Expected endpoints:
// GET /addresses
// POST /addresses
// PATCH /addresses/:id
// DELETE /addresses/:id
// PATCH /addresses/:id/default

async function getAddresses() {
  const response = await api.get("/addresses");
  return response.data.data;
}

async function createAddress(addressData) {
  const response = await api.post("/addresses", addressData);
  return response.data.data;
}

async function updateAddress(id, addressData) {
  const response = await api.patch(`/addresses/${id}`, addressData);
  return response.data.data;
}

async function deleteAddress(id) {
  const response = await api.delete(`/addresses/${id}`);
  return response.data.data;
}

async function setDefaultAddress(id) {
  const response = await api.patch(`/addresses/${id}/default`);
  return response.data.data;
}

const addressService = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

export default addressService;
