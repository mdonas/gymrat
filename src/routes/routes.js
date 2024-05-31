import { Router } from "express";
import {
  getUser,
  getAllEjercicios,
  getRutina,
  getAllRutinas,
  getEjercicio,
  createEjercicio,
  deleteEjercicio,
  updateEjercicio,
  checkUserRegistro,
} from "../controllers/controller.js";

const router = Router();

router.get("/login/:user", getUser);
router.get("/registrar/:correo", getUser);

router.get("/rutinas/:id", getRutina);
router.get("/rutinas", getAllRutinas);

router.get("/ejercicios", getAllEjercicios);

router.get("/ejercicios/:id", getEjercicio);

router.post("/ejercicios", createEjercicio);

router.post("/registrar", checkUserRegistro);

router.delete("/ejercicios/:id", deleteEjercicio);

router.put("/ejercicios/:id", updateEjercicio);

export default router;
