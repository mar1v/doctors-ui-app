import { Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const errorHandler = (err: ApiError, _req: Request, res: Response) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Внутрішня помилка сервера";

  res.status(status).json({ message });
};
