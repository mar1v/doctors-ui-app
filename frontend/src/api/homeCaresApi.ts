import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/home-cares";

export interface IHomeCare {
  _id?: string;
  name: string;
  morning: boolean;
  evening: boolean;
  medicationName?: string;
}
export const getAllHomeCares = async (): Promise<IHomeCare[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const searchHomeCaresByName = async (
  name?: string
): Promise<IHomeCare[]> => {
  const params: Record<string, string> = {};
  if (name) params.search = name;
  const { data } = await axios.get<IHomeCare[]>(API_URL, { params });
  return data;
};
