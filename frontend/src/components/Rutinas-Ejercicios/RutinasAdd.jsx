/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RutinasAdd() {
  const location = useLocation();
  const tituloDia = location.state;
  const { id } = useParams();
  const idInt = Math.floor(parseInt(id, 10));
  const navigate = useNavigate();

  const [ejercicios, setEjercicios] = useState([]);
  const [ejercicioRutina, setEjercicioRutina] = useState({
    id_ejercicio: 1,
    id_rutina: idInt,
    titulo_dia: tituloDia,
  });
  const [rutina, setRutina] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const loadEjercicios = async () => {
    const response = await fetch("http://localhost:4000/ejercicios");
    const data = await response.json();
    console.log(data);
    setEjercicios(data);
  };
  const loadRutina = async () => {
    const response = await fetch(`http://localhost:4000/rutinas/${id}`);
    const data = await response.json();
    console.log(data);
    setRutina(data[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:4000/ejercicios/rutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ejercicioRutina),
      });
      navigate(`/rutinas/editar/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    if (e.target.name == "ejercicio") {
      setEjercicioRutina({ ...ejercicioRutina, id_ejercicio: e.target.value });
    } else if (e.target.name == "titulo_dia") {
      setEjercicioRutina({
        ...ejercicioRutina,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setEjercicioRutina({
        ...ejercicioRutina,
        [e.target.name]: e.target.value,
      });
    }
    setSelectedOption({
      id_ejercicio: e.target.value,
    });

    console.log(ejercicioRutina);
  };

  useEffect(() => {
    loadEjercicios();
    loadRutina();
  }, []);
  return (
    <>
      <div className="container bg-main m-0 m-auto mt-3 rounded-2 pb-2">
        <h2>{rutina.nombre}</h2>
        <table className="text-start m-0 m-auto">
          <tr className="text-center">
            <th className="pe-2">Ejercicio</th>
            <th className="pe-2">Titulo_dia</th>
            <th className="pe-2">Dia</th>
            <th className="pe-2">Orden</th>
            <th className="pe-2">Series</th>
            <th className="pe-2">Repeticiones</th>
          </tr>
          <select
            className="form-control bg-white mb-2  rounded-3"
            name="ejercicio"
            id=""
            onChange={handleChange}
            defaultValue={selectedOption}
          >
            {ejercicios.map((ejercicio) => (
              <option key={ejercicio.id} value={ejercicio.id_ejercicio}>
                {ejercicio.nombre}
              </option>
            ))}
          </select>
          <td key={12}>
            <input
              className="form-control bg-white mb-2  rounded-3"
              type="text"
              name="titulo_dia"
              id=""
              defaultValue={tituloDia}
              onChange={handleChange}
            />
          </td>
          <td key={12}>
            <input
              className="form-control bg-white mb-2  rounded-3s"
              type="number"
              name="dia"
              id=""
              onChange={handleChange}
            />
          </td>
          <td key={12}>
            <input
              className="form-control bg-white mb-2  rounded-3"
              type="number"
              name="orden"
              id=""
              onChange={handleChange}
            />
          </td>
          <td key={12}>
            <input
              className="form-control bg-white mb-2  rounded-3"
              type="number"
              name="series"
              id=""
              onChange={handleChange}
            />
          </td>
          <td key={12}>
            <input
              className="form-control bg-white mb-2  rounded-3"
              type="text"
              name="repeticiones"
              id=""
              onChange={handleChange}
            />
          </td>
        </table>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-naranja mt-2 me-2"
          onClick={() => {
            navigate(`/rutinas/editar/${id}`);
          }}
        >
          Volver
        </button>
        <button
          type="submit"
          className="btn btn-verde mt-2"
          onClick={handleSubmit}
        >
          Añadir
        </button>
      </div>
    </>
  );
}
