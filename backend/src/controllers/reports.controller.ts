import { NextFunction, Request, Response } from "express";
import * as ReportService from "../services/reports.service";
import ApiError from "../utils/ApiError";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Payload:", req.body);
    const report = await ReportService.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    console.log("Payload:", req.body);
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reports = await ReportService.getAll();
    res.json(reports);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await ReportService.getById(req.params.id);
    if (!report) return next(ApiError.notFound("Звіт не знайдено"));
    res.json(report);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};
export const getByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params;
    const report = await ReportService.getByPatientId(patientId);

    if (!report) return res.status(404).json({ message: "Звіт не знайдено" });
    res.json(report);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await ReportService.update(req.params.id, req.body);
    if (!report) return next(ApiError.notFound("Звіт не знайдено"));
    res.json(report);
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Помилка при оновленні звіту"));
  }
};
