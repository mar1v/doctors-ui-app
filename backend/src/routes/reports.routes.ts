import { Router } from "express";
import * as ReportsController from "../controllers/reports.controller";

const router = Router();

router.get("/", ReportsController.getAll);
router.get("/:id", ReportsController.getById);
router.post("/", ReportsController.create);
router.put("/:id", ReportsController.update);
router.get("/patient/:patientId", ReportsController.getByPatientId);

export default router;
