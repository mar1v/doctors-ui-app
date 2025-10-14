import Patient, { IPatient } from "../models/PatientSchema";

export const getAll = (filter = {}) => {
  return Patient.find(filter);
};

export const getOne = (id: string) => {
  return Patient.findById(id);
};

export const count = async (filter = {}): Promise<number> => {
  return Patient.countDocuments(filter);
};

export const create = async (data: IPatient): Promise<IPatient> => {
  const patient = new Patient(data);
  return patient.save();
};

export const update = async (
  id: string,
  data: Partial<Omit<IPatient, "createdAt">>
): Promise<IPatient | null> => {
  return Patient.findByIdAndUpdate(id, { $set: data }, { new: true });
};
