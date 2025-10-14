import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const loginUser = async (email: string, password: string) => {
  return (await axios.post(`${API_URL}/login`, { email, password })).data;
};

export const registerUser = async (email: string, password: string) => {
  return (await axios.post(`${API_URL}/register`, { email, password })).data;
};
