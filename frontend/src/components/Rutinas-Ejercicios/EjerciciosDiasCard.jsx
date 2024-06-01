import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EjerciciosDiasCard({ rutina }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [registroEntreno, setRegistroEntreno] = useState([]);
  // console.log(ejercicios);

  const loadEjercicios = async () => {
    const response = await fetch(
      `http://localhost:4000/rutinas/${rutina.id_rutina}/ejercicios`
    );
    const data = await response.json();
    setEjercicios(data);
    separarEjercios();
    // console.log(data);
  };
  function handleClick(e) {
    handleEntrenamiento(e.target.value);
  }
  async function handleEntrenamiento(tituloDia) {
    const fecha = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;
    setRegistroEntreno({
      id_rutina: rutina.id_rutina,
      fecha_entrenamiento: fecha,
      dia_rutina: ejerciciosPorDia[tituloDia][0].dia,
    });
    console.log(registroEntreno);
    try {
      const res = await fetch("http://localhost:4000/rutina/entreno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registroEntreno),
      });
      if (res.ok) {
        alert("Se ha resgistrado su entreno ");
      } else {
        alert("Ha habido un error al registrar su entreno");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadEjercicios();
  }, [rutina.id_rutina]);

  const [ejerciciosPorDia, setEjerciciosPorDia] = useState({});
  const [titulosUnicos, setTitulosUnicos] = useState([]);
  console.log(ejerciciosPorDia);
  function separarEjercios() {
    const ejerciciosSeparados = {};
    const titulosSeparados = [];

    for (const exercise of ejercicios) {
      const tituloDia = exercise.titulo_dia;

      if (!ejerciciosSeparados[tituloDia]) {
        ejerciciosSeparados[tituloDia] = [];
      }

      ejerciciosSeparados[tituloDia].push(exercise);
      if (!titulosSeparados.includes(tituloDia)) {
        titulosSeparados.push(tituloDia);
      }
    }

    setEjerciciosPorDia(ejerciciosSeparados);
    setTitulosUnicos(titulosSeparados);
  }

  return (
    <div className="text-white p-3 my-2 ">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="font-bold text-xl">- {rutina.nombre}</h3>
        <div className="">
          <Link to={`/rutinas/editar/${rutina.id_rutina}`} className="me-2">
            <img src="../../img/pen-solid.svg" alt="" width={30} />
          </Link>
          <div className="d-inline">
            <img src="../../img/trash-solid.svg" alt="" width={26} />
          </div>
        </div>
      </div>
      {titulosUnicos.map((titulo) => (
        <div
          key={titulo}
          className=" my-2 ps-3 pt-3 bg-main text-black rounded-3"
        >
          <div className="d-flex justify-content-between mb-2">
            <h3 className="font-bold text-xl">{titulo}</h3>
            <button
              className="btn btn-verde me-3"
              onClick={handleClick}
              value={titulo}
            >
              Hacer Entrenamiento
            </button>
          </div>
          <div className="container">
            <div className="d-flex justify-content-around text-center">
              {ejerciciosPorDia[titulo].map((ejercicio) => (
                <>
                  <div key={ejercicio.ejercicio_nombre}>
                    <p>{ejercicio.ejercicio_nombre}</p>
                    <p>
                      {ejercicio.series} X {ejercicio.repeticiones}
                    </p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EjerciciosDiasCard;
