import { Router } from "express";
import * as MedicationsController from "../controllers/medications.controller";

const router = Router();

router.get("/", MedicationsController.getAllMedications);
router.get("/:query", MedicationsController.searchMedications);
router.post("/", MedicationsController.createMedication);
router.put("/:id", MedicationsController.updateMedication);

export default router;
