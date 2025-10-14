import { Router } from "express";
import * as SpecialistController from "../controllers/specialist.contoller";

const router = Router();

router.get("/", SpecialistController.getAll);
router.get("/:query", SpecialistController.searchSpecialists);
router.post("/", SpecialistController.create);
router.put("/:id", SpecialistController.update);

export default router;
