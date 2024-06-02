import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutinasList from "./components/Rutinas-Ejercicios/RutinasList";
import LoginForm from "./components/Login-Register/LoginForm";
import RegisterForm from "./components/Login-Register/RegisterForm";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import RutinasEditar from "./components/Rutinas-Ejercicios/RutinasEditar";
import RutinasAdd from "./components/Rutinas-Ejercicios/RutinasAdd";
import Recuperacion from "./components/Recuperacion/Recuperacion";
import Historial from "./components/Historial/Historial";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route path="/rutinas" element={<RutinasList />} />
          <Route path="/rutinas/editar/:id" element={<RutinasEditar />} />
          <Route path="/rutinas/editar/:id/añadir" element={<RutinasAdd />} />
          <Route path="/recuperacion" element={<Recuperacion />}></Route>
          <Route path="/historial" element={<Historial />}></Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
