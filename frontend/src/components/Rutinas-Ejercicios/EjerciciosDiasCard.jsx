import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EjerciciosDiasCard({ rutina }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [registroEntreno, setRegistroEntreno] = useState([]);
  const [musculosEntrenos, setMusculosEntrenos] = useState([]);
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
  const loadMusculosEntrenos = async () => {
    const response = await fetch(`http://localhost:4000/musculos/entrenos`);
    const data = await response.json();
    setMusculosEntrenos(data);
    // console.log(data);
  };
  function handleClick(e) {
    handleEntrenamiento(e.target.value);
  }
  async function handleEntrenamiento(tituloDia) {
    const fecha = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;
    const user = JSON.parse(localStorage.user);
    const musculos = musculosEntrenos
      .filter((dato) => dato.titulo_dia === tituloDia && dato.id_rutina === 1)
      .map((dato) => dato.nombre_musculo)
      .filter((musculo, index, self) => self.indexOf(musculo) === index); // elimina duplicados

    const stringMusculos = musculos.join(", ");
    console.log(stringMusculos);

    setRegistroEntreno({
      id_rutina: rutina.id_rutina,
      fecha_entrenamiento: fecha,
      dia_rutina: ejerciciosPorDia[tituloDia][0].dia,
      id_usuario: user.id_usuario,
      tipo_entreno: stringMusculos,
    });
    console.log(user);
  }

  useEffect(() => {
    loadEjercicios();
    loadMusculosEntrenos();
  }, [ejercicios]);

  useEffect(() => {
    if (registroEntreno) {
      // eslint-disable-next-line no-inner-declarations
      async function fetchData() {
        try {
          const res = await fetch("http://localhost:4000/rutina/entreno", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registroEntreno),
          });
          if (res.ok) {
            alert("Se ha registrado su entreno ");
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }
  }, [registroEntreno]);

  const [ejerciciosPorDia, setEjerciciosPorDia] = useState({});
  const [titulosUnicos, setTitulosUnicos] = useState([]);
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
