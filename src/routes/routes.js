import { Router } from "express";
import {
  getUser,
  getAllEjercicios,
  getEjerciciosFromRutina,
  getDiasFromRutina,
  getRutina,
  getAllRutinas,
  getEjercicio,
  createEjercicio,
  addEjercicioRutina,
  deleteEjercicio,
  updateEjercicio,
  updateEjerciciosRutina,
  checkUserRegistro,
} from "../controllers/controller.js";

const router = Router();

router.get("/login/:user", getUser);
router.get("/registrar/:correo", getUser);

router.get("/rutinas/:id", getRutina);
router.get("/rutinas", getAllRutinas);
router.get("/rutinas/:id/ejercicios", getEjerciciosFromRutina);
router.get("/rutinas/:id/dias", getDiasFromRutina);

router.get("/ejercicios", getAllEjercicios);

router.get("/ejercicios/:id", getEjercicio);

router.post("/ejercicios", createEjercicio);
router.post("/ejercicios/rutina", addEjercicioRutina);

router.post("/registrar", checkUserRegistro);

router.delete("/ejercicios/:id", deleteEjercicio);

router.put("/ejercicios/:id", updateEjercicio);
router.put("/rutinas/editar", updateEjerciciosRutina);

export default router;
