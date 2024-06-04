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
  createRegistroEntreno,
  addEjercicioRutina,
  deleteEjercicio,
  updateEjercicio,
  updateEjerciciosRutina,
  checkUserRegistro,
  getRegistrosEntreno,
  getMusculos,
  getMusculosEntrenos,
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

router.get("/recuperacion/:id", getRegistrosEntreno);

router.get("/musculos", getMusculos);
router.get("/musculos/entrenos", getMusculosEntrenos);

router.post("/registrar", checkUserRegistro);

router.post("/ejercicios", createEjercicio);
router.post("/ejercicios/rutina", addEjercicioRutina);
router.post("/rutina/entreno", createRegistroEntreno);
router.post("/registro/ejercicios", createRegistroEntreno);

router.delete("/ejercicios/:id", deleteEjercicio);

router.put("/ejercicios/:id", updateEjercicio);
router.put("/rutinas/editar", updateEjerciciosRutina);

export default router;
