import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RutinasEditar() {
  const [ejercicios, setEjercicios] = useState([]);
  const [newEjercicios, setNewEjercicios] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const loadEjercicios = async () => {
    const response = await fetch(
      `http://localhost:4000/rutinas/${id}/ejercicios`
    );
    const data = await response.json();
    setEjercicios(data);
    setNewEjercicios(data);
    console.log(data);
  };
  useEffect(() => {
    loadEjercicios();
  }, []);

  function handleAdd(titulo) {
    navigate("añadir", { state: titulo });
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name == "repeticiones") {
      handleCambioCampo(e.target.id, { [name]: value });
    } else {
      handleCambioCampo(e.target.id, { [name]: parseInt(value, 10) });
    }
  }
  function handleCambioCampo(id, camposActualizados) {
    const ejercicioaActualizar = ejercicios.find(
      (exercise) => exercise.id_ejercicio == id
    );
    if (ejercicioaActualizar) {
      const ejercicioActualizado = {
        ...ejercicioaActualizar,
        ...camposActualizados,
      };
      const ejerciciosActualizados = ejercicios.map((exercise) =>
        exercise.id_ejercicio == id ? ejercicioActualizado : exercise
      );
      setNewEjercicios(ejerciciosActualizados);
    } else {
      console.log("no entro");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    newEjercicios.forEach(async (ejercicio) => {
      console.log(ejercicio);
      try {
        await fetch("http://localhost:4000/rutinas/editar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ejercicio),
        });
        navigate("/rutinas");
      } catch (error) {
        console.error(error);
      }
    });
  };

  const ejerciciosPorDia = ejercicios.reduce((acc, current) => {
    const { titulo_dia } = current;
    if (!acc[titulo_dia]) {
      acc[titulo_dia] = [];
    }
    acc[titulo_dia].push(current);
    return acc;
  }, {});
  Object.keys(ejerciciosPorDia).forEach((titulo) => {
    ejerciciosPorDia[titulo].sort((a, b) => a.orden - b.orden);
  });
  console.log(ejerciciosPorDia);

  return (
    <>
      <div className="">
        {Object.entries(ejerciciosPorDia).map(([titulo, ejercicios]) => (
          <div
            key={titulo}
            className="bg-main m-0 m-auto my-3 py-3 rounded-2 w-75 pe-4 "
          >
            <div className="container">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-0">{titulo}</h2>
                <img
                  src="../../img/plus-solid.svg"
                  alt=""
                  width={30}
                  onClick={() => handleAdd(titulo)}
                />
              </div>
              <table className="text-start m-0 m-auto">
                <tr className="text-center">
                  <th></th>
                  <th className="">Orden</th>
                  <th className="">Series</th>
                  <th className="">Repeticiones</th>
                  <th className="">Peso</th>
                </tr>
                {ejercicios.map((ejercicio, index) => (
                  <>
                    <tr>
                      <td className="" key={index + ejercicio.orden}>
                        {ejercicio.ejercicio_nombre}
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2  rounded-3"
                          type="number"
                          name="orden"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.orden}
                          onChange={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2  rounded-3"
                          type="number"
                          name="series"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.series}
                          onChange={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2 rounded-3"
                          type="text"
                          name="repeticiones"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.repeticiones}
                          onChange={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.peso}>
                        <input
                          className="form-control bg-white mb-2 rounded-3"
                          type="number"
                          name="peso"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.peso}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </table>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pb-2">
        <button
          type="submit"
          className="btn btn-naranja  me-2"
          onClick={() => {
            navigate(`/rutinas`);
          }}
        >
          Volver
        </button>
        <button type="submit" className="btn btn-verde" onClick={handleSubmit}>
          Añadir
        </button>
      </div>
    </>
  );
}
