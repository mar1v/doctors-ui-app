import express from "express";
import {
  createHomeCare,
  getAllHomeCares,
} from "../controllers/homeCareController";

const router = express.Router();

router.get("/", getAllHomeCares);
router.post("/", createHomeCare);

export default router;
