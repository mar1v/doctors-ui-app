import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/home-cares";

export interface IHomeCare {
  _id?: string;
  name: string;
  morning: boolean;
  evening: boolean;
}

export const getAllHomeCares = async (): Promise<IHomeCare[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const searchHomeCaresByName = async (
  name: string
): Promise<IHomeCare[]> => {
  const { data } = await axios.get(
    `${API_URL}?search=${encodeURIComponent(name)}`
  );
  return data;
};
