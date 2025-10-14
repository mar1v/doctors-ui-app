import axios from "axios";

export interface IExam {
  _id?: string;
  name: string;
  query?: string;
  recommendation: string;
}

const API_URL = import.meta.env.VITE_API_URL + "/exams";
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const getAllExams = async () => (await axios.get<IExam[]>(API_URL)).data;
export const searchExamsByName = async (query: string) =>
  (await axios.get<IExam[]>(`${API_URL}/search`, { params: { query } })).data;
export const createExam = async (exam: IExam) =>
  (await axios.post(API_URL, exam)).data;
export const updateExam = async (id: string, exam: IExam) =>
  (await axios.put(`${API_URL}/${id}`, exam)).data;
