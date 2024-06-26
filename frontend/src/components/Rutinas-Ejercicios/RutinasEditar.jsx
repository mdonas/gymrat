import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RutinasEditar() {
  const [ejercicios, setEjercicios] = useState([]);
  const [newEjercicios, setNewEjercicios] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const fecha = `${new Date().getDate()}-${
    new Date().getMonth() + 1
  }-${new Date().getFullYear()}`;

  const loadEjercicios = async () => {
    const response = await fetch(
      `http://localhost:4000/rutinas/${id}/ejercicios`
    );
    const data = await response.json();
    setEjercicios(data);
    console.log(data);
  };
  useEffect(() => {
    loadEjercicios();
  }, []);

  //le pasamos el titulo del dia para ponerlo en el input
  function handleAdd(titulo) {
    navigate("añadir", { state: titulo });
  }
  function handleChange(e) {
    const { name, value } = e.target;
    console.log(fecha);
    if (name == "repeticiones") {
      handleCambioCampo(e.target.id, { [name]: value, fecha_edicion: fecha });
    } else {
      handleCambioCampo(e.target.id, {
        [name]: parseInt(value, 10),
        fecha_edicion: fecha,
      });
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

      if (
        newEjercicios.find((ejercicio) => {
          return (
            ejercicio.id_ejercicio_rutina ==
            ejercicioActualizado.id_ejercicio_rutina
          );
        })
      ) {
        const newEjerciciosBien = newEjercicios.map((exercise) =>
          exercise.id_ejercicio == id ? ejercicioActualizado : exercise
        );
        setNewEjercicios(newEjerciciosBien);
      } else {
        setNewEjercicios([...newEjercicios, ejercicioActualizado]);
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    newEjercicios.forEach(async (ejercicio) => {
      try {
        await fetch("http://localhost:4000/ejercicios/rutina", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ejercicio),
        });
        navigate("/rutinas");
      } catch (error) {
        console.error(error);
      }
    });
  };

  //generamos un array con los dias , que dentro contienen los ejercicios de cada dia
  const ejerciciosPorDia = ejercicios.reduce((acc, current) => {
    const { titulo_dia, id_ejercicio } = current;
    if (!acc[titulo_dia]) {
      acc[titulo_dia] = [];
    }
    const ejercicioYaExiste = acc[titulo_dia].find((ejercicio) => {
      return ejercicio.id_ejercicio == id_ejercicio;
    });
    if (!ejercicioYaExiste) {
      acc[titulo_dia].push(current);
    }
    return acc;
  }, {});
  //lo reccorremos sobre las keys, los dias, y los ordenamos
  Object.keys(ejerciciosPorDia).forEach((titulo) => {
    ejerciciosPorDia[titulo].sort((a, b) => a.orden - b.orden);
  });

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
                      <td className="" key={1 + 12}>
                        {ejercicio.ejercicio_nombre}
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2  rounded-3"
                          type="number"
                          name="orden"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.orden}
                          onBlur={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2  rounded-3"
                          type="number"
                          name="series"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.series}
                          onBlur={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.orden}>
                        <input
                          className="form-control bg-white mb-2 rounded-3"
                          type="text"
                          name="repeticiones"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.repeticiones}
                          onBlur={handleChange}
                        />
                      </td>
                      <td key={index + ejercicio.peso}>
                        <input
                          className="form-control bg-white mb-2 rounded-3"
                          type="number"
                          name="peso"
                          id={ejercicio.id_ejercicio}
                          defaultValue={ejercicio.peso}
                          onBlur={handleChange}
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
