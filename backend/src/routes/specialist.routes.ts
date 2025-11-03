import { Router } from "express";
import * as SpecialistController from "../controllers/specialist.contoller";

const router = Router();

router.get("/", SpecialistController.getAll);
router.get("/:query", SpecialistController.searchSpecialists);
router.post("/", SpecialistController.createdSpecialist);
router.put("/:id", SpecialistController.updatedSpecialist);
router.delete("/:id", SpecialistController.deletedSpecialist);

export default router;
