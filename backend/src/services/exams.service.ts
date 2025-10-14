import Exam, { IExam } from "../models/ExamSchema";

export const getAll = async (): Promise<IExam[]> => {
  return Exam.find();
};
export const searchByName = async (query: string): Promise<IExam[]> => {
  return Exam.find({
    name: { $regex: query, $options: "i" },
  }).limit(20);
};
export const create = async (data: {
  name: string;
  recommendation: string;
}): Promise<IExam> => {
  const exam = new Exam(data);
  return exam.save();
};
export const update = async (
  id: string,
  data: { name: string }
): Promise<IExam | null> => {
  return Exam.findByIdAndUpdate(id, { $set: data }, { new: true });
};
