import { useEffect, useState } from "react";
import DateCalendarServerRequest from "./Calendario";

export default function Historial() {
  const user = JSON.parse(localStorage.user);

  const [entrenos, setEntrenos] = useState([]);
  const loadEntrenos = async () => {
    const response = await fetch(
      `http://localhost:4000/recuperacion/${user.id_usuario}`
    );
    const data = await response.json();
    setEntrenos(data);
    console.log(data);
  };

  function cuentaDiasEntrenados() {
    console.log(entrenos);
    const diasEntrenamiento = entrenos.map((entreno) =>
      entreno.fecha_entrenamiento.substring(0, 10)
    ); // extraemos la fecha sin la hora
    console.log(diasEntrenamiento);
    const diasUnicos = [...new Set(diasEntrenamiento)]; // eliminamos duplicados
    const diasSemana = diasUnicos.map((fecha) => {
      const diaSemana = new Date(fecha).getDay(); // convertimos la fecha a día de la semana (0 = domingo, 1 = lunes,..., 6 = sábado)
      return diaSemana;
    });
    const diasEntrenados = [...new Set(diasSemana)]; // eliminamos duplicados
    // console.log(diasEntrenados);

    return diasEntrenados.length;
  }
  function cuentaSemanasEntrenadas() {
    const entrenosPorSemana = entrenos.reduce((acc, item) => {
      const fecha = item.fecha_entrenamiento.substring(0, 10);
      const semana = getWeekNumber(fecha); // función para obtener el número de semana del año
      if (!acc[semana]) {
        acc[semana] = [];
      }
      acc[semana].push(fecha);
      return acc;
    }, {});

    function getWeekNumber(dateString) {
      const date = new Date(dateString);
      const onejan = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    }

    let semanasCon5Dias = 0;
    Object.keys(entrenosPorSemana).forEach((semana) => {
      const entrenos = entrenosPorSemana[semana];
      const diasUnicos = [
        ...new Set(entrenos.map((fecha) => new Date(fecha).getDay())),
      ];
      if (diasUnicos.length >= 5) {
        semanasCon5Dias++;
      }
    });
    return semanasCon5Dias;
  }
  const diasUnicos = Array.from(
    new Set(
      entrenos.map((item) => new Date(item.fecha_entrenamiento).getDate())
    )
  );
  useEffect(() => {
    loadEntrenos();
  }, [entrenos]);
  return (
    <>
      <div className="container text-center mt-2">
        <div className="d-flex justify-content-between ">
          <div className="col">
            <h3 className="text-gris">Total Entrenos</h3>
            <h4 className="text-white">{entrenos.length}</h4>
          </div>
          <div className="col">
            <h3 className="text-gris">Racha Semanal</h3>
            <h4 className="text-white">{cuentaDiasEntrenados()}/5</h4>
          </div>
          <div className="col">
            <h3 className="text-gris">Semanas en Racha</h3>
            <h4 className="text-white">{cuentaSemanasEntrenadas()}</h4>
          </div>
        </div>
        <div className="">
          <DateCalendarServerRequest
            diasUnicos={diasUnicos}
          ></DateCalendarServerRequest>
        </div>
      </div>
    </>
  );
}
