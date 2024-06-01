import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutinasList from "./components/RutinasList";
import TaskForm from "./components/TaskForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import RutinasEditar from "./components/RutinasEditar";
import RutinasAdd from "./components/RutinasAdd";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route path="/ejercicios/new" element={<TaskForm />} />
          <Route path="/rutinas" element={<RutinasList />} />
          <Route path="/rutinas/editar/:id" element={<RutinasEditar />} />
          <Route path="/rutinas/editar/:id/añadir" element={<RutinasAdd />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
