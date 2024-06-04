import { useEffect, useState } from "react";
import BasicColor from "./Grafico";

export default function Progreso() {
  const user = JSON.parse(localStorage.user);

  const [musculos, setMusculos] = useState([]);
  const [entrenos, setEntrenos] = useState([]);
  const [ejerciciosEntrenos, setEjerciciosEntrenos] = useState([]);
  const [selectedOption, setSelectedOption] = useState(musculos[0] || null);
  const [seriesEjercicio, setSeriesEjercicio] = useState([]);
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

  const handleChange = (e) => {
    const selectedMusculo = musculos.find(
      (musculo) => musculo.id_musculo == e.target.value
    );
    console.log(ejerciciosEntrenos);

    setSelectedOption(selectedMusculo);
  };
  useEffect(() => {
    if (selectedOption && ejerciciosEntrenos) {
      selectedEjercicio = ejerciciosEntrenos.find(
        (entreno) => entreno.nombre_musculo === selectedOption.nombre_musculo
      ).nombre;
      setSeriesEjercicio(calculateSeriesEjercicios(selectedEjercicio));
    }
  }, [selectedOption, ejerciciosEntrenos]);

  function calculateSeriesEjercicios(ejercicio) {
    console.log(ejercicio);
    const nombreElegido = ejercicio;
    const pesos = ejerciciosEntrenos
      .filter((dato) => dato.nombre === nombreElegido)
      .map((dato) => {
        return dato.peso;
      });
    console.log(pesos); // [7, 8, 7, 7,...]

    return pesos;
  }

  useEffect(() => {
    loadMusculos();
    loadEntrenos();
    loadEjerciciosEntrenos();
  }, []);
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
                  ejerciciosEntrenos.find(
                    (entreno) =>
                      entreno.nombre_musculo === selectedOption?.nombre_musculo
                  )?.nombre || "NO hay registros"
                }
              />
            </div>
          </div>
        </div>
        <BasicColor
          series={seriesEjercicio}
          updateSeries={(newSeries) => setSeriesEjercicio(newSeries)}
          xAxisLabels={["Enero", "Febrero", "Marzo", "Abril", "Mayo"]}
        ></BasicColor>
      </div>
    </>
  );
}
