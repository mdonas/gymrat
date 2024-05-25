import { Router } from "express";
import {
  getAllEjercicios,
  getRutina,
  getEjercicio,
  createEjercicio,
  deleteEjercicio,
  updateEjercicio,
} from "../controllers/controller.js";

const router = Router();

router.get("/rutinas/:id", getRutina);

router.get("/ejercicios", getAllEjercicios);

router.get("/ejercicios/:id", getEjercicio);

router.post("/ejercicios", createEjercicio);

router.delete("/ejercicios/:id", deleteEjercicio);

router.put("/ejercicios/:id", updateEjercicio);

export default router;
