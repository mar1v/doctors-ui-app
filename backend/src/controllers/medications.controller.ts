// controllers/medications.controller.ts
import { NextFunction, Request, Response } from "express";
import * as MedicationsService from "../services/medications.service";
import ApiError from "../utils/ApiError";

export const getAllMedications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meds = await MedicationsService.getAll();
    res.json(meds);
  } catch (err) {
    console.log(err);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const searchMedications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query || req.params.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Помилка запиту" });
    }
    const exams = await MedicationsService.searchByName(query.trim());
    res.json(exams);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const createMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, recommendation } = req.body;
    const newMed = await MedicationsService.create({ name, recommendation });
    res.status(201).json(newMed);
  } catch (err) {
    console.log(err);
    next(ApiError.badRequest("Помилка запиту"));
  }
};

export const updateMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedMed = await MedicationsService.update(id, { name });
    if (!updatedMed) return next(ApiError.notFound("Не знайдено"));
    res.json(updatedMed);
  } catch (err) {
    console.log(err);
    next(ApiError.internal("Помилка сервера"));
  }
};
