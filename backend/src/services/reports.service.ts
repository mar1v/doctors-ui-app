import mongoose from "mongoose";
import Exam from "../models/ExamSchema";
import Medication from "../models/MedicationSchema";
import Procedure from "../models/ProcedureSchema";
import Report, { IReport, IReportHomeCare } from "../models/ReportSchema";
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

  const homeCaresData: IReportHomeCare[] =
    data.homeCares?.map((h) => ({
      _id: h._id || new mongoose.Types.ObjectId().toString(),
      name: h.name,
      morning: h.morning,
      evening: h.evening,
      medicationName: h.medicationName || "",
    })) ?? [];

  const reportData: IReport = {
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
    homeCares: homeCaresData,
    additionalInfo: data.additionalInfo,
    comments: data.comments,
  } as IReport;

  return await Report.create(reportData);
};

export const getAll = async () => Report.find();
export const getById = async (id: string) => Report.findById(id);
export const getByPatientId = async (patientId: string) =>
  Report.findOne({ patient: patientId });
export const update = async (id: string, data: Partial<IReport>) =>
  Report.findByIdAndUpdate(id, data, { new: true });
