import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email і пароль обов'язкові" });
  }

  try {
    const user = await AuthService.register(email, password);
    res.status(201).json({
      email: user.email,
      role: user.role,
      id: user._id,
    });
  } catch (err) {
    const errorMessage = (err as Error).message || "Помилка реєстрації";
    return res.status(400).json({ message: errorMessage });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email і пароль обов'язкові" });
  }

  try {
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (err) {
    const errorMessage = (err as Error).message || "Помилка входу";
    return res.status(400).json({ message: errorMessage });
  }
};
