const pool = require("../db");

const getAllTasks = async (req, res, next) => {
  try {
    const alltask = await pool.query("SELECT * FROM task");

    res.json(alltask.rows);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await pool.query("SELECT * FROM task where id=$1", [id]);

    if (task.rows.length === 0)
      return res.status(404).json({ message: "Task Not Found" });

    res.json(task.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, descripcion } = req.body;

    const result = await pool.query(
      "INSERT INTO task (title,descripcion) VALUES ($1,$2) RETURNING *",
      [title, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await pool.query("DELETE FROM task where id=$1 ", [id]);

    if (task.rowCount === 0)
      return res.status(404).json({ message: "Task Not Found" });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, descripcion } = req.body;

    const result = await pool.query(
      "UPDATE task SET title=$1, descripcion =$2 WHERE id =$3 RETURNING *",
      [title, descripcion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not Found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
