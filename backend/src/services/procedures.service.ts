import Procedure, { IProcedure } from "../models/ProcedureSchema";

export const getAll = async (): Promise<IProcedure[]> => {
  return Procedure.find();
};
export const searchByName = async (query: string): Promise<IProcedure[]> => {
  return Procedure.find({
    name: { $regex: query, $options: "i" },
  }).limit(20);
};
export const create = async (data: {
  name: string;
  recommendation: string;
}): Promise<IProcedure> => {
  const procedure = new Procedure(data);
  return procedure.save();
};

export const update = async (
  id: string,
  data: { name: string }
): Promise<IProcedure | null> => {
  return Procedure.findByIdAndUpdate(id, { $set: data }, { new: true });
};
