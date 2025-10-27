import axios from "axios";

export interface IReport {
  _id?: string;
  patient: string;
  medications: { name: string; recommendation: string }[];
  procedures: { name: string; recommendation: string }[];
  specialists: { name: string }[];
  exams: { name: string; recommendation: string }[];
  homeCares: {
    name: string;
    morning: boolean;
    evening: boolean;
  }[];
  additionalInfo?: string;
  comments?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL + `/reports`;

export const getAllReports = async (): Promise<IReport[]> => {
  const response = await axios.get<IReport[]>(API_URL);
  return response.data;
};

export const getReportById = async (id: string): Promise<IReport> => {
  const response = await axios.get<IReport>(`${API_URL}/${id}`);
  return response.data;
};

export const getReportByPatientId = async (patientId: string) =>
  (await axios.get(`${API_URL}/patient/${patientId}`)).data;

export const createReport = async (
  report: Partial<IReport>
): Promise<IReport> => {
  const response = await axios.post<IReport>(API_URL, report);
  return response.data;
};

export const updateReport = async (
  id: string,
  report: Partial<IReport>
): Promise<IReport> => {
  const response = await axios.put<IReport>(`${API_URL}/${id}`, report);
  return response.data;
};

export const reportsApi = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
};
