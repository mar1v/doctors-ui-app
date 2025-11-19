import express from "express";
import * as PatientController from "../controllers/patient.controller";

const router = express.Router();

router.get("/", PatientController.getAllPatients);
router.get("/:id", PatientController.getPatientById);
router.post("/", PatientController.createPatient);
router.put("/:id", PatientController.updatePatient);
router.delete("/:id", PatientController.deletePatient);

export default router;
