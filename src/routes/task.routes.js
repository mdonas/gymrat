const { Router } = require("express");
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const router = Router();

router.get("/ejercicios", getAllTasks);

router.get("/ejercicios/:id", getTask);

router.post("/ejercicios", createTask);

router.delete("/ejercicios/:id", deleteTask);

router.put("/ejercicios/:id", updateTask);

module.exports = router;
