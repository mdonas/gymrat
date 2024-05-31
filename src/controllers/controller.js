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

export const getRutina = async (req, res, next) => {
  const { id } = req.params;
  try {
    const query =
      "SELECT e.nombre, er.orden, er.series " +
      "FROM ejercicios_rutina er JOIN ejercicios e ON er.id_ejercicio = e.id_ejercicio " +
      "WHERE er.id_rutina = $1";

    const rutina = await pool.query(query, [id]);
    res.json(rutina.rows);
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

export const checkUserRegistro = async (req, res, next) => {
  try {
    let { nombre, correo, usuario, contrasena } = req.body;
    //si no quieren actualizar el nombre lo mantenemos
    let getUsuario = await pool.query(
      "SELECT usuario FROM usuario where usuario=$1",
      [usuario]
    );
    //si no quieren actualizar la descripcion lo mantenemos
    let getEmail = await pool.query(
      "SELECT correo FROM usuario where correo=$1",
      [correo]
    );
    if (getEmail.rowCount != 0) {
      return res
        .status(404)
        .json({ message: "Ya existe una cuenta con ese email" });
    } else if (getUsuario.rowCount != 0) {
      return res.status(404).json({ message: "Ya existe ese usuario" });
    } else {
      await pool.query(
        "INSERT INTO usuario (nombre, correo,contrasena, usuario) VALUES ($1,$2,$3,$4) RETURNING *",
        [nombre, correo, contrasena, usuario]
      );
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
