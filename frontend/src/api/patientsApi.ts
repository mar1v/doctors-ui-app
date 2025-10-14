import axios from "axios";

export interface IPatient {
  _id?: string;
  fullName: string;
  birthDate: Date;
  phoneNumber: string;
  email?: string;
  diagnosis?: string;
}

interface ApiResponse {
  patients: IPatient[];
  totalPages: number;
  query: string;
}
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const API_URL = import.meta.env.VITE_API_URL + `/patients`;

export const getAllPatients = async (
  page: number,
  limit: number,
  query: string
) => {
  const response = await axios.get<ApiResponse>(
    `${API_URL}?page=${page}&limit=${limit}&query=${query}`
  );
  return response.data;
};

export const getPatientById = async (id: string) =>
  (await axios.get(`${API_URL}/${id}`)).data;
export const createPatient = async (patient: IPatient) =>
  (await axios.post(API_URL, patient)).data;

export const updatePatient = async (id: string, patient: IPatient) =>
  (await axios.put(`${API_URL}/${id}`, patient)).data;
