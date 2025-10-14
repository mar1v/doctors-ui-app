import jwt from "jsonwebtoken";
import User from "../models/UserSchema";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Користувач вже існує");

  const user = new User({ email, password });
  await user.save();

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Неправильний email або пароль");

  const match = await user.comparePassword(password);

  if (!match) throw new Error("Неправильний email або пароль");

  const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
    expiresIn: "24h",
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
