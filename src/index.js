import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/routes.js";
import { port } from "./config.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a mi Back" });
});

app.use(router);

// handling errors
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(port);
console.log(`Servidor en el puerto: ${port}`);
