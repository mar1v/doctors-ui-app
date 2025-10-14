import express from "express";
import * as ExamsController from "../controllers/exams.controller";

const router = express.Router();

router.get("/", ExamsController.getAllExams);
router.get("/:query", ExamsController.searchExams);
router.post("/", ExamsController.createExam);
router.put("/:id", ExamsController.updateExam);

export default router;
