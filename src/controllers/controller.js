import { query } from "express";
import { pool } from "../db.js";

export const getUser = async (req, res, next) => {
  try {
    const { user, correo } = req.params;
    console.log(user, correo);

    if (user) {
      console.log("user");
      const usuario = await pool.query(
        "SELECT * FROM usuario where usuario=$1",
        [user]
      );

      res.json(usuario.rows);
    } else {
      console.log("correo");
      const usuario = await pool.query(
        "SELECT correo FROM usuario where correo=$1",
        [correo]
      );

      res.json(usuario.rows);
    }
  } catch (error) {
    next(error);
  }
};

export const getAllEjercicios = async (req, res, next) => {
  try {
    const allEjercicios = await pool.query("SELECT * FROM ejercicios");

    res.json(allEjercicios.rows);
  } catch (error) {
    next(error);
  }
};
export const getMusculos = async (req, res, next) => {
  try {
    const allMusculos = await pool.query("SELECT * FROM musculos");

    res.json(allMusculos.rows);
  } catch (error) {
    next(error);
  }
};
export const getAllRutinas = async (req, res, next) => {
  try {
    const allEjercicios = await pool.query("SELECT * FROM rutinas");

    res.json(allEjercicios.rows);
  } catch (error) {
    next(error);
  }
};
export const getRegistrosEntreno = async (req, res, next) => {
  const { id } = req.params;
  try {
    const allRegistros = await pool.query(
      "SELECT * FROM registros_entrenamiento where id_usuario=$1 order by registros_entrenamiento.fecha_entrenamiento",
      [id]
    );

    res.json(allRegistros.rows);
  } catch (error) {
    next(error);
  }
};

export const getRutina = async (req, res, next) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM rutinas WHERE id_rutina = $1";

    const rutina = await pool.query(query, [id]);
    res.json(rutina.rows);
  } catch (error) {
    next(error);
  }
};
export const getEjerciciosFromRutina = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query =
      " SELECT er.orden, er.series, er.dia, er.titulo_dia,er.repeticiones,er.id_rutina,er.peso,er.fecha_edicion, " +
      "er.id_ejercicio_rutina,er.id_ejercicio, e.nombre AS ejercicio_nombre " +
      "FROM ejercicios_rutina AS er " +
      "JOIN ejercicios AS e ON er.id_ejercicio = e.id_ejercicio " +
      "WHERE er.id_rutina = $1 ORDER BY er.dia , er.fecha_edicion desc";
    const allEjercicios = await pool.query(query, [id]);

    res.json(allEjercicios.rows);
  } catch (error) {
    next(error);
  }
};
export const getDiasFromRutina = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query =
      " SELECT DISTINCT er.titulo_dia , er.id_rutina, er.dia " +
      "from ejercicios_rutina as er where er.id_rutina >$1 ORDER BY er.dia ";
    const allDias = await pool.query(query, [id]);

    res.json(allDias.rows);
  } catch (error) {
    next(error);
  }
};

export const getMusculosEntrenos = async (req, res, next) => {
  try {
    let query =
      "SELECT ejercicios.nombre, musculos.nombre_musculo, ejercicios_rutina.titulo_dia, ejercicios_rutina.fecha_edicion ," +
      "ejercicios_rutina.id_rutina, ejercicios_rutina.dia,ejercicios_rutina.series, ejercicios_rutina.repeticiones,ejercicios_rutina.peso " +
      "FROM ejercicios " +
      "JOIN ejercicios_rutina ON ejercicios.id_ejercicio = ejercicios_rutina.id_ejercicio " +
      "JOIN musculos ON ejercicios.id_musculo = musculos.id_musculo " +
      "Order by ejercicios_rutina.fecha_edicion DESC";

    const ejercicio = await pool.query(query);
    res.json(ejercicio.rows);
  } catch (error) {
    next(error);
  }
};
export const getEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicio = await pool.query(
      "SELECT * FROM ejercicios where id_ejercicio=$1",
      [id]
    );

    if (ejercicio.rows.length === 0)
      return res.status(404).json({ message: "Ejercicio no encontrado" });

    res.json(ejercicio.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createEjercicio = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      "INSERT INTO ejercicios (nombre,descripcion) VALUES ($1,$2) RETURNING *",
      [nombre, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
export const createRegistroEntreno = async (req, res, next) => {
  try {
    const {
      id_rutina,
      fecha_entrenamiento,
      dia_rutina,
      id_usuario,
      tipo_entreno,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO registros_entrenamiento (id_rutina, fecha_entrenamiento, dia_rutina,id_usuario,tipo_entreno) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [id_rutina, fecha_entrenamiento, dia_rutina, id_usuario, tipo_entreno]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
export const addEjercicioRutina = async (req, res, next) => {
  try {
    const {
      dia,
      id_ejercicio,
      id_rutina,
      orden,
      repeticiones,
      series,
      peso,
      titulo_dia,
      fecha_edicion,
    } = req.body;

    const query =
      "INSERT INTO ejercicios_rutina (id_rutina, id_ejercicio, orden, series, dia, titulo_dia, repeticiones, peso, fecha_edicion) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const result = await pool.query(query, [
      id_rutina,
      id_ejercicio,
      orden,
      series,
      dia,
      titulo_dia,
      repeticiones,
      peso,
      fecha_edicion,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await pool.query(
      "DELETE FROM ejercicios where id_ejercicio=$1 ",
      [id]
    );

    if (task.rowCount === 0)
      return res.status(404).json({ message: "Ejercicio no encontrado" });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const updateEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { nombre, descripcion } = req.body;
    //si no quieren actualizar el nombre lo mantenemos
    if (nombre == "" || nombre == null) {
      let getNombre = await pool.query(
        "SELECT nombre FROM ejercicios where id_ejercicio=$1",
        [id]
      );
      nombre = getNombre.rows[0].nombre;
    }
    //si no quieren actualizar la descripcion lo mantenemos
    if (descripcion == "" || descripcion == null) {
      let getDescripcion = await pool.query(
        "SELECT descripcion FROM ejercicios where id_ejercicio=$1",
        [id]
      );
      descripcion = getDescripcion.rows[0].descripcion;
    }
    const result = await pool.query(
      "UPDATE ejercicios SET nombre=$1, descripcion =$2 WHERE id_ejercicio =$3 RETURNING *",
      [nombre, descripcion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Ejercicio no encontrado" });

    res.json(result.rows[0]);

    console.log(nombre);
    res.json({});
  } catch (error) {
    next(error);
  }
};
export const updateEjerciciosRutina = async (req, res, next) => {
  try {
    const {
      dia,
      id_ejercicio,
      id_rutina,
      orden,
      repeticiones,
      series,
      peso,
      titulo_dia,
      id_ejercicio_rutina,
      fecha_edicion,
    } = req.body;
    //si no quieren actualizar el nombre lo mantenemos
    const query =
      `UPDATE ejercicios_rutina SET id_rutina = $1, id_ejercicio = $2, orden = $3, series = $4, dia = $5, ` +
      `titulo_dia = $6, repeticiones = $7,peso=$9 ,fecha_edicion=$10 ` +
      `WHERE id_ejercicio_rutina=$8 RETURNING *`;
    const result = await pool.query(query, [
      id_rutina,
      id_ejercicio,
      orden,
      series,
      dia,
      titulo_dia,
      repeticiones,
      id_ejercicio_rutina,
      peso,
      fecha_edicion,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Ejercicio no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const checkUserRegistro = async (req, res, next) => {
  try {
    let { nombre, correo, usuario, contrasena } = req.body;
    //si no quieren actualizar el nombre lo mantenemos

    const res = await pool.query(
      "INSERT INTO usuario (nombre, correo,contrasena, usuario) VALUES ($1,$2,$3,$4) RETURNING *",
      [nombre, correo, contrasena, usuario]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
