import { Router } from "express";
import * as ProceduresController from "../controllers/procedures.controller";

const router = Router();

router.get("/", ProceduresController.getAllProcedures);
router.get("/:query", ProceduresController.searchProcedures);
router.post("/", ProceduresController.createProcedure);
router.put("/:id", ProceduresController.updateProcedure);
router.delete("/:id", ProceduresController.deleteProcedure);

export default router;
