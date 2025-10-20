import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const loginUser = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  return data;
};

export const registerUser = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/register`, { email, password });
  return data;
};

export const getCurrentUser = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
