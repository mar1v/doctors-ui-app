import Exam from "../models/ExamSchema";
import Medication from "../models/MedicationSchema";
import Procedure from "../models/ProcedureSchema";
import Report, { IReport } from "../models/ReportSchema";
import Specialist from "../models/SpecialistSchema";

export const create = async (data: IReport) => {
  const extractNames = (arr: (string | { name: string })[]) =>
    arr.map((item) => (typeof item === "string" ? item : item.name));

  const medications = await Medication.find({
    name: { $in: extractNames(data.medications) },
  });

  const procedures = await Procedure.find({
    name: { $in: extractNames(data.procedures) },
  });

  const exams = await Exam.find({
    name: { $in: extractNames(data.exams) },
  });

  const specialists = await Specialist.find({
    name: { $in: extractNames(data.specialists) },
  });

  const reportData = {
    patient: data.patient,
    medications: medications.map((m) => ({
      name: m.name,
      recommendation: m.recommendation,
    })),
    procedures: procedures.map((p) => ({
      name: p.name,
      recommendation: p.recommendation,
    })),
    exams: exams.map((e) => ({
      name: e.name,
      recommendation: e.recommendation,
    })),
    specialists: specialists.map((s) => ({ name: s.name })),
    psychoScale: data.psychoScale,
    comments: data.comments,
  };

  return await Report.create(reportData);
};

export const getAll = async () => {
  return await Report.find();
};

export const getById = async (id: string) => {
  return await Report.findById(id);
};
export const getByPatientId = async (patientId: string) => {
  return await Report.findOne({ patient: patientId });
};

export const update = async (id: string, data: Partial<IReport>) => {
  return await Report.findByIdAndUpdate(id, data, { new: true });
};
