import { Request, Response } from "express";
import {
  createHomeCareService,
  getAllHomeCaresService,
} from "../services/homeCare.service";

export const getAllHomeCares = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString();
    const homeCares = await getAllHomeCaresService(search);
    res.json(homeCares);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createHomeCare = async (req: Request, res: Response) => {
  try {
    const homeCare = await createHomeCareService(req.body);
    res.status(201).json(homeCare);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
