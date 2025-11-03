import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/specialists";

export interface ISpecialist {
  _id?: string;
  name: string;
  query?: string;
}

export const getAllSpecialists = async () =>
  (await axios.get<ISpecialist[]>(API_URL)).data;
export const searchSpecialistsByName = async (query: string) =>
  (await axios.get<ISpecialist[]>(`${API_URL}/search`, { params: { query } }))
    .data;
export const createSpecialist = async (specialist: ISpecialist) =>
  (await axios.post(API_URL, specialist)).data;
export const updateSpecialist = async (id: string, specialist: ISpecialist) =>
  (await axios.put(`${API_URL}/${id}`, specialist)).data;
export const deleteSpecialist = async (id: string) =>
  (await axios.delete(`${API_URL}/${id}`)).data;
