import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/procedures";

export interface IProcedure {
  _id?: string;
  name: string;
  query?: string;
  recommendation: string;
}

export const getAllProcedures = async () =>
  (await axios.get<IProcedure[]>(API_URL)).data;
export const searchProceduresByName = async (query: string) =>
  (await axios.get<IProcedure[]>(`${API_URL}/search`, { params: { query } }))
    .data;
export const createProcedure = async (procedure: IProcedure) =>
  (await axios.post(API_URL, procedure)).data;
export const updateProcedure = async (id: string, procedure: IProcedure) =>
  (await axios.put(`${API_URL}/${id}`, procedure)).data;
