import { NextFunction, Request, Response } from "express";
import * as specialistService from "../services/specialist.service";
import ApiError from "../utils/ApiError";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const specialists = await specialistService.getAll();
    res.json(specialists);
  } catch (err) {
    console.error(err);
    return next(ApiError.internal("Помилка сервера"));
  }
};

export const searchSpecialists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query || req.params.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Помилка запиту" });
    }
    const specialists = await specialistService.searchByName(query.trim());
    res.json(specialists);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const newSpecialist = await specialistService.create({ name });
    res.status(201).json(newSpecialist);
  } catch (err) {
    console.error(err);
    return next(ApiError.badRequest("Помилка запиту"));
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedSpecialist = await specialistService.update(id, { name });
    if (!updatedSpecialist) {
      return next(ApiError.notFound("Не знайдено"));
    }
    res.json(updatedSpecialist);
  } catch (err) {
    console.error(err);
    next(ApiError.badRequest("Помилка запиту"));
  }
};
