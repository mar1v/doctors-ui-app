import { NextFunction, Request, Response } from "express";
import * as ExamsService from "../services/exams.service";
import ApiError from "../utils/ApiError";

export const getAllExams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exams = await ExamsService.getAll();
    res.json(exams);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const searchExams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query || req.params.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Помилка запиту" });
    }
    const exams = await ExamsService.searchByName(query.trim());
    res.json(exams);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const createExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, recommendation } = req.body;
    const newExam = await ExamsService.create({ name, recommendation });
    res.status(201).json(newExam);
  } catch (err) {
    console.error(err);
    next(ApiError.badRequest("Помилка запиту"));
  }
};

export const updateExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedExam = await ExamsService.update(id, { name });
    if (!updatedExam) return next(ApiError.notFound("Не знайдено"));
    res.json(updatedExam);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};
export const deleteExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedExam = await ExamsService.remove(id);
    if (!deletedExam) return next(ApiError.notFound("Не знайдено"));
    res.json(deletedExam);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};
