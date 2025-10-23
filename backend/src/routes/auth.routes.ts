import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
