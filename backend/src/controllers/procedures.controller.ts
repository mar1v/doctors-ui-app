import { NextFunction, Request, Response } from "express";
import * as ProceduresService from "../services/procedures.service";
import ApiError from "../utils/ApiError";

export const getAllProcedures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const procedure = await ProceduresService.getAll();
    res.status(200).send(procedure);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const searchProcedures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query || req.params.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Помилка запиту" });
    }
    const procedures = await ProceduresService.searchByName(query.trim());
    res.json(procedures);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const createProcedure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, recommendation } = req.body;
    const newProcedure = await ProceduresService.create({
      name,
      recommendation,
    });
    res.status(201).json(newProcedure);
  } catch (error) {
    console.error(error);
    next(ApiError.badRequest("Помилка запиту"));
  }
};

export const updateProcedure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedProcedure = await ProceduresService.update(id, { name });
    if (!updatedProcedure) {
      return next(ApiError.notFound("Не знайдено"));
    }
    res.json(updatedProcedure);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};

export const deleteProcedure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedProcedure = await ProceduresService.remove(id);
    if (!deletedProcedure) {
      return next(ApiError.notFound("Не знайдено"));
    }
    res.json(deletedProcedure);
  } catch (error) {
    console.error(error);
    next(ApiError.internal("Помилка сервера"));
  }
};
