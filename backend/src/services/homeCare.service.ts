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
