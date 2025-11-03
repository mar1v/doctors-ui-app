import HomeCare from "../models/HomeCareSchema";

export const getAllHomeCaresService = async (search?: string) => {
  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  return await HomeCare.find(query);
};

export const createHomeCareService = async (data: {
  name: string;
  morning?: boolean;
  evening?: boolean;
}) => {
  return await HomeCare.create(data);
};
export const updateHomeCareService = async (
  id: string,
  data: { name: string; morning?: boolean; evening?: boolean }
) => {
  return await HomeCare.findByIdAndUpdate(id, { $set: data }, { new: true });
};
export const deleteHomeCareService = async (id: string) => {
  return await HomeCare.findByIdAndDelete(id);
};
