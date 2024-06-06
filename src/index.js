import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/routes.js";
import { port } from "./config.js";

const app = express();

// Middlewares
//Cors para permitir peticiones cross-origin
app.use(cors());
// Morgan para mostrar logs de las peticiones
app.use(morgan("dev"));
// Parsear body de las peticiones en formato JSON
app.use(express.json());
// Parsear body de las peticiones en formato URL encoded
app.use(express.urlencoded({ extended: false }));

// Routes
//creo que se puede eliminar este trozo
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a mi Back" });
});

//usamos las rutas que hemos configurado
app.use(router);

// El controlador de errores , para que edvuelva le mensaje
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

// Iniciar servidor en el puerto concreto
app.listen(port);
console.log(`Servidor en el puerto: ${port}`);
