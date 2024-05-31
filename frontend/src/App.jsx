import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route path="/ejercicios/new" element={<TaskForm />} />
          <Route path="/rutinas" element={<TaskList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
