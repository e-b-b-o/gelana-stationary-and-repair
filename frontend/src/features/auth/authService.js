import { api } from "../../lib/axios.js";

async function register(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data;
}

async function login(credentials) {
  const response = await api.post("/auth/login", credentials);

  return response.data;
}

async function logout() {
  const response = await api.post("/auth/logout");

  return response.data;
}

async function getProfile() {
  const response = await api.get("/auth/profile");

  return response.data;
}

async function updateProfile(updatedData) {
  const response = await api.patch("/auth/profile", updatedData);

  return response.data;
}

async function changePassword(passwordData) {
  const response = await api.patch("/auth/change-password", passwordData);

  return response.data;
}

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
