/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DateCalendarServerRequest from "./Calendario";

export default function Historial() {
  const user = JSON.parse(localStorage.user);

  const [entrenos, setEntrenos] = useState([]);
  const [ultimos6Entrenos, setultimos6Entrenos] = useState([]);
  const [musculosEntrenos, setMusculosEntrenos] = useState([]);
  const [entrenosUnicos, setEntrenosUnicos] = useState([]);
  //cargamos registros del usuario
  const loadEntrenos = async () => {
    const response = await fetch(
      `http://localhost:4000/recuperacion/${user.id_usuario}`
    );
    const data = await response.json();
    setEntrenos(data);
    console.log(data);
  };
  //recupera los datos de ejercicios_rutina ademas del nombre del ejercicio y el nombre del musculo
  const loadMusculosEntrenos = async () => {
    const response = await fetch(`http://localhost:4000/musculos/entrenos`);
    const data = await response.json();
    setMusculosEntrenos(data);
    // console.log(data);
  };

  function cuentaDiasEntrenados() {
    //vamos a establecer el dia de comienzo y de final de la semana y despues comprobar si esta en ese rango
    const hoy = new Date();
    const diaSemanaActual = hoy.getDay();
    const primerDiaSemana =
      diaSemanaActual === 0
        ? hoy.getDate() - 6
        : hoy.getDate() - diaSemanaActual + 1; // primer día de la semana actual
    const ultimoDiaSemana = primerDiaSemana + 6; // último día de la semana actual

    const entrenosSemanaActual = entrenos.filter((entreno) => {
      const fechaEntreno = new Date(entreno.fecha_entrenamiento);

      return (
        fechaEntreno.getDate() >= primerDiaSemana &&
        fechaEntreno.getDate() <= ultimoDiaSemana
      );
    });
    //despues recuperamos los dias de la semana que han sido Luneas,Martes,Miercole
    const diasEntrenamiento = entrenosSemanaActual.map((entreno) =>
      entreno.fecha_entrenamiento.substring(0, 10)
    ); // extraemos la fecha sin la hora
    //y los asignamos al set para depsues medir y saber los dias que ha ido en la semana
    const diasUnicos = [...new Set(diasEntrenamiento)]; // eliminamos duplicados

    return diasUnicos.length;
  }

  function cuentaSemanasEntrenadas() {
    //recuperamos los enterenos separados por la semana a la que pertenecen semana 12,semana13...
    const entrenosPorSemana = entrenos.reduce((acumulador, entreno) => {
      const fecha = entreno.fecha_entrenamiento.substring(0, 10);
      const semana = getNumeroSemana(fecha); // función para obtener el número de semana del año
      if (!acumulador[semana]) {
        acumulador[semana] = [];
      }
      acumulador[semana].push(fecha);
      return acumulador;
    }, {});

    console.log(entrenosPorSemana);

    //despues recuperamos la semana actual, semana22
    function getNumeroSemana(dateString) {
      const date = new Date(dateString);
      const onejan = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    }

    let semanasCon5Dias = 0;
    //iteramos por los keys,las semanas y comprobamos que halla 5 dias en esa semana, lo establecido como racha
    Object.keys(entrenosPorSemana).forEach((semana) => {
      const entrenos = entrenosPorSemana[semana];
      const diasUnicos = [
        ...new Set(entrenos.map((fecha) => new Date(fecha).getDay())),
      ];
      if (diasUnicos.length >= 5) {
        semanasCon5Dias++;
      }
    });
    //devolvemos lo acumulado
    return semanasCon5Dias;
  }
  //dias a pasar al calendario
  //filtramos los entrenos de este mes en un set, convertimos a arrray y mapeamos recuperando el dia
  const diasUnicos = Array.from(
    new Set(
      entrenos
        .filter(
          (item) =>
            new Date(item.fecha_entrenamiento).getMonth() ===
            new Date().getMonth()
        )
        .map((item) => new Date(item.fecha_entrenamiento).getDate())
    )
  );

  //recuperamos los 5 ultimos entrenos y formateamos
  function getUltimos6Entrenos() {
    let entrenosRecientes = entrenos.slice(-6);
    console.log(entrenos);
    console.log(entrenosRecientes);

    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    //formateamos la fecha para cada entreno
    const entrenosFormateados = entrenosRecientes.map((dato) => {
      const fecha = new Date(dato.fecha_entrenamiento);
      const dia = fecha.getDate();
      const mes = meses[fecha.getMonth()];
      const fechaFormateada = `${dia} ${mes}`;
      return { ...dato, fecha_entrenamiento: fechaFormateada };
    });
    //los ordenamos
    entrenosFormateados.sort((a, b) => {
      const fechaA = new Date(a.fecha_entrenamiento);
      const fechaB = new Date(b.fecha_entrenamiento);
      return fechaB - fechaA;
    });
    //los guardamos en el estado
    setultimos6Entrenos(entrenosFormateados);
  }
  //calculamos el total de ejercicios y de repeticiones por entreno
  const getEntrenosUnicos = musculosEntrenos.reduce((acumulador, entreno) => {
    const { id_rutina, dia, titulo_dia, series, repeticiones } = entreno;
    console.log(entreno);
    let totalRepes;
    if (repeticiones.includes("-")) {
      const [_, repeticionesMax] = repeticiones.split("-");
      totalRepes = series * parseInt(repeticionesMax, 10);
    } else {
      totalRepes = series * parseInt(repeticiones, 10);
    }
    const entrenoExistente = acumulador.find(
      (item) => item.id_rutina === id_rutina && item.dia === dia
    );
    //Al ser una referencia al objeto , al actualizar la referencia se actualiza el objeto original
    if (entrenoExistente) {
      entrenoExistente.totalEjercicios++; // incrementar contador de ejercicios
    } else {
      acumulador.push({
        id_rutina,
        titulo_dia,
        dia,
        totalRepes,
        totalEjercicios: 1, // inicializar contador de ejercicios
      });
    }

    return acumulador;
  }, []);

  useEffect(() => {
    loadEntrenos();
    loadMusculosEntrenos();
    getUltimos6Entrenos();
    setEntrenosUnicos(getEntrenosUnicos);
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
        <div className="calendar">
          <DateCalendarServerRequest
            diasUnicos={diasUnicos}
          ></DateCalendarServerRequest>
        </div>
        <div className="text-start">
          <h4 className="text-white">Ultimos Entrenos</h4>
          <div className="row justify-content-between">
            {ultimos6Entrenos.map((entreno, index) => (
              <div className="col-5 bg-main m-2 pb-3 rounded-2" key={index}>
                <div className="d-flex justify-content-between">
                  <p className="h4 mt-2">
                    {entrenosUnicos.find(
                      (entrenoU) =>
                        entrenoU.dia == entreno.dia_rutina &&
                        entrenoU.id_rutina == entreno.id_rutina
                    )?.titulo_dia || ""}
                    {" - "}
                    {entreno.tipo_entreno}
                  </p>
                  <p className="h4 mt-2">{entreno.fecha_entrenamiento}</p>
                </div>
                <div className="d-flex justify-content-around text-center">
                  <div className="">
                    <p className="text-grisOscuro">Total Ejercicios</p>
                    <p className="h5">
                      {entrenosUnicos.find(
                        (entrenoU) =>
                          entrenoU.dia == entreno.dia_rutina &&
                          entrenoU.id_rutina == entreno.id_rutina
                      )?.totalEjercicios || ""}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-grisOscuro">Total Repes</p>
                    <p className="h5">
                      {entrenosUnicos.find(
                        (entrenoU) =>
                          entrenoU.dia == entreno.dia_rutina &&
                          entrenoU.id_rutina == entreno.id_rutina
                      )?.totalRepes || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
