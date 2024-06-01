import { useState, useEffect } from "react";
import EjerciciosDiasCard from "./EjerciciosDiasCard";

const RutinasList = () => {
  const [rutinas, setRutinas] = useState([]);

  const loadRutinas = async () => {
    const response = await fetch("http://localhost:4000/rutinas");
    const data = await response.json();
    console.log(data);
    setRutinas(data);
  };

  useEffect(() => {
    loadRutinas();
  }, []);

  return (
    <>
      {rutinas.map((rutina) => (
        <EjerciciosDiasCard key={rutina.id_rutina} rutina={rutina} />
      ))}
    </>
  );
};

export default RutinasList;
