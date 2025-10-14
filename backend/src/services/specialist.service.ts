import Specialist, { ISpecialist } from "../models/SpecialistSchema";

export const getAll = async (): Promise<ISpecialist[]> => {
  return Specialist.find();
};
export const searchByName = async (query: string): Promise<ISpecialist[]> => {
  return Specialist.find({
    name: { $regex: query, $options: "i" },
  }).limit(20);
};
export const create = async (data: { name: string }): Promise<ISpecialist> => {
  const specialist = new Specialist(data);
  return specialist.save();
};
export const update = async (
  id: string,
  data: { name: string }
): Promise<ISpecialist | null> => {
  return Specialist.findByIdAndUpdate(id, { $set: data }, { new: true });
};
