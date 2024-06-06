import { useEffect, useState } from "react";
import BasicColor from "./Grafico";

export default function Progreso() {
  const user = JSON.parse(localStorage.user);

  const [musculos, setMusculos] = useState([]);
  const [entrenos, setEntrenos] = useState([]);
  //todos los ejercicios que sale
  const [ejerciciosEntrenos, setEjerciciosEntrenos] = useState([]);
  const [totalEjercicios, setTotalEjercicios] = useState([]);
  const [selectedOption, setSelectedOption] = useState(musculos[0] || null);
  const [pesosEjercicios, setPesosEjercicios] = useState([]);
  let selectedEjercicio;

  const loadMusculos = async () => {
    const response = await fetch(`http://localhost:4000/musculos`);
    const data = await response.json();
    setMusculos(data);
    const pressBanca = data.find((musculo) => {
      return musculo.nombre_musculo === "Pecho";
    });
    setSelectedOption(pressBanca);
    console.log(data);
  };
  const loadEjerciciosEntrenos = async () => {
    const response = await fetch(`http://localhost:4000/musculos/entrenos`);
    const data = await response.json();
    setEjerciciosEntrenos(data);
    // console.log(data);
  };
  const loadEntrenos = async () => {
    const response = await fetch(
      `http://localhost:4000/recuperacion/${user.id_usuario}`
    );
    const data = await response.json();
    setEntrenos(data);
    console.log(data);
  };
  //vamos a recorrer los entrenos que ha realizado el usuario he iremos añadiendo los ejercicios que pertenecen a esos dias de esas rutinas
  const loadTotalEjercicios = () => {
    const ejerciciosUnicos = [];
    entrenos.forEach((entreno) => {
      ejerciciosEntrenos.forEach((ejercicio) => {
        if (
          entreno.id_rutina == ejercicio.id_rutina &&
          entreno.dia_rutina == ejercicio.dia
        ) {
          ejerciciosUnicos.push(ejercicio);
        }
      });
    });

    //elemento es el ejercicio que comprobamos en cada iteracion
    //el indice es el numero de iteracion
    //vamos a buscar en el array original el primer objeto que tenga los mismos valores que el elemento de la iteracion
    //cuendo lo encuentra devuelve su posicion en el arrayOriginal que debera coincidir con el indice
    //Si el indice no coincide significa que antes del elemento que estamos iterando, ya habia otro igual
    const ejerciciosBien = ejerciciosUnicos.filter(
      (elemento, indice, arrayOriginal) => {
        return (
          arrayOriginal.findIndex((entreno) => {
            return (
              entreno.nombre === elemento.nombre &&
              entreno.nombre_musculo === elemento.nombre_musculo &&
              entreno.titulo_dia === elemento.titulo_dia &&
              entreno.fecha_edicion === elemento.fecha_edicion &&
              entreno.id_rutina === elemento.id_rutina
            );
          }) === indice
        );
      }
    );
    //recuperaremos los ejercicios no duplicados , si el peso no es igual no se considera como duplicado, que es lo que necesitamos

    console.log(ejerciciosBien);
    setTotalEjercicios([...ejerciciosBien]);
  };
  //al cargar la paginas establecemos los estados
  useEffect(() => {
    loadMusculos();
    loadEntrenos();
    loadEjerciciosEntrenos();
  }, []);
  //al cambiar el estado de entrenos, se ejecuta esta funcion
  //cargamos el total de ejercicios realizados, buscamos el ejercicio seleccionado y calculamos los pesos del ejercicio seleccionado
  useEffect(() => {
    if (entrenos.length > 0 && ejerciciosEntrenos.length > 0) {
      loadTotalEjercicios();
    }
    if (selectedOption && ejerciciosEntrenos) {
      selectedEjercicio = ejerciciosEntrenos.find(
        (entreno) => entreno.nombre_musculo === selectedOption.nombre_musculo
      ).nombre;
      setPesosEjercicios(calculatePesosEjercicios(selectedEjercicio));
    }
  }, [entrenos, selectedOption, ejerciciosEntrenos]);

  //cuando cambiamos el musculo actualizamos la opcion seleccionada por lo que se actualiza el ejercicio
  const handleChange = (e) => {
    const selectedMusculo = musculos.find(
      (musculo) => musculo.id_musculo == e.target.value
    );
    console.log(ejerciciosEntrenos);

    setSelectedOption(selectedMusculo);
  };
  //vamos a recuperar las diferentes filas del ejercicio elegido y recuperamos los pessos
  function calculatePesosEjercicios(ejercicio) {
    console.log(ejercicio);
    const nombreElegido = ejercicio;
    const pesos = totalEjercicios
      .filter((dato) => dato.nombre === nombreElegido)
      .map((dato) => {
        return dato.peso;
      });
    console.log(pesos); // [7, 8, 7, 7,...]

    return pesos;
  }
  return (
    <>
      <div className="container text-center mt-2">
        <div className="d-flex justify-content-between ">
          <div className="col">
            <h3 className="text-gris">Grupo Muscular</h3>
            <div className="d-flex justify-content-center">
              <select
                name="ejercicio"
                id=""
                className="form-control fs-5 bg-white mb-2 rounded-3 w-50 text-center"
                onChange={handleChange}
                defaultValue={selectedOption}
              >
                {musculos.map((musculo) => (
                  <option key={musculo.id_musculo} value={musculo.id_musculo}>
                    {musculo.nombre_musculo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col">
            <h3 className="text-gris">Fecha</h3>
            <div className="d-flex justify-content-center">
              <input
                type="text"
                readOnly
                className=" form-control fs-5 bg-white mb-2 rounded-3 w-50 text-center"
                value="Este Mes"
              />
            </div>
          </div>
          <div className="col">
            <h3 className="text-gris">Ejercicio</h3>
            <div className="d-flex justify-content-center">
              <input
                type="text"
                className="form-control fs-5 bg-white mb-2 rounded-3 w-50 text-center"
                readOnly
                value={
                  totalEjercicios.find(
                    (entreno) =>
                      entreno.nombre_musculo === selectedOption?.nombre_musculo
                  )?.nombre || "NO hay registros"
                }
              />
            </div>
          </div>
        </div>
        <BasicColor
          series={pesosEjercicios}
          updateSeries={(newSeries) => setPesosEjercicios(newSeries)}
        ></BasicColor>
      </div>
    </>
  );
}
