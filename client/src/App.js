import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import NavBar from "./components/Navbar";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/ejercicios/new" element={<TaskForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
