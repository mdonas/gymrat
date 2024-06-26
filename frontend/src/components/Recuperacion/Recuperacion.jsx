import { useEffect, useState } from "react";

export default function Recuperacion() {
  const user = JSON.parse(localStorage.user);
  console.log(localStorage);
  const [entrenos, setEntrenos] = useState([]);
  const [ultimosEntrenos, setUltmosEntrenos] = useState([]);
  const [musculos, setMusculos] = useState([]);
  let entrenoMasReciente;
  let diasDesdeEntreno;

  //cargos registros de un user
  const loadEntrenos = async () => {
    const response = await fetch(
      `http://localhost:4000/recuperacion/${user.id_usuario}`
    );
    const data = await response.json();
    setEntrenos(data);
    // console.log(data);
  };
  //cargamos los datos de lla tabla musculos
  const loadMusculos = async () => {
    const response = await fetch(`http://localhost:4000/musculos`);
    const data = await response.json();
    setMusculos(data);
    // console.log(data);
  };
  //
  const loadEntrenos3Dias = () => {
    loadEntrenos();
    let entrenosRecientes = entrenos.slice(-3);
    //ordenamos de mas reciente a mas antiguo ya que luego .find devuelva la primera que cumple el requisito
    //si no ordenamos si hemos hecho pecho hace 2 dias y hoy, solo tendria en cuent la de hace 2 dias
    entrenosRecientes.sort((a, b) => {
      return new Date(b.fecha_entrenamiento) - new Date(a.fecha_entrenamiento);
    });
    //recorremos los tres entrenos y almacenamos en un set, no duplicados los distintos tipos entrenos
    //lo pasamos a array y lo mapeamos para sacar los entrenos completos de los primeros que sean de ese tipo entreno
    //eliminamos duplicados para quedarnos con los unicos mas recientes
    console.log(entrenosRecientes);
    const entrenamientosUnicos = Array.from(
      new Set(
        entrenosRecientes.map((entrenamiento) => entrenamiento.tipo_entreno)
      )
    ).map((tipo) =>
      entrenosRecientes.find(
        (entrenamiento) => entrenamiento.tipo_entreno == tipo
      )
    );
    console.log(entrenamientosUnicos);
    setUltmosEntrenos(entrenamientosUnicos);
  };

  useEffect(() => {
    loadMusculos();
    loadEntrenos3Dias();
  }, [musculos]);

  //previo es el acumulador que en este caso va a guardar el entreno mas reciente
  if (entrenos && entrenos.length > 0) {
    entrenoMasReciente = entrenos.reduce((previo, actual) => {
      if (
        !previo ||
        new Date(actual.fecha_entrenamiento) >
          new Date(previo.fecha_entrenamiento)
      ) {
        return actual;
      } else {
        return previo;
      }
    });
  }
  //calculamos los dias desde el ultimo entreno
  if (entrenoMasReciente) {
    const ultimoEntrenamiento = new Date(
      entrenoMasReciente.fecha_entrenamiento
    );
    const diasTranscurridos = Math.floor(
      (Date.now() - ultimoEntrenamiento.getTime()) / 86400000
    );
    if (diasTranscurridos == -1) {
      diasDesdeEntreno = diasTranscurridos;
    } else {
      diasDesdeEntreno = diasTranscurridos;
    }
  }
  //calculamos los dias desde ese entreno
  //cuando es en el mismo dia devolvia -1
  function calculaDias(entreno) {
    const ultimoEntrenamiento = new Date(entreno.fecha_entrenamiento);
    const diasTranscurridos = Math.floor(
      (Date.now() - ultimoEntrenamiento.getTime()) / 86400000
    );
    let diasDesde;
    if (diasTranscurridos == -1) {
      diasDesde = 0;
    } else {
      diasDesde = diasTranscurridos;
    }
    return diasDesde;
  }
  //comprobamos si se ha entrenado el musculo, si es asi calculamos dias sino valor por defecto
  function comprobarMusculo(musculo, entreno) {
    if (entreno.tipo_entreno.includes(musculo.nombre_musculo)) {
      return calculaDias(entreno);
    } else {
      return "+3";
    }
  }
  //llamamos a comprobarMusculo y enfuncion de donde se llame a este funcion y lo que devuelva comprobarmusculo devolvemos unos valores u otros
  function comprobarEstado(musculo, entreno, tipo) {
    const resultado = comprobarMusculo(musculo, entreno);
    if (tipo == "clase") {
      if (resultado == 0) {
        return "bg-rojo";
      } else if (resultado == 1) {
        return "bg-naranja";
      } else {
        return "bg-verde";
      }
    } else if (tipo == "texto1") {
      if (resultado == 0) {
        return "No recuperado";
      } else if (resultado == 1) {
        return "En proceso";
      } else {
        return "Recuperado";
      }
    } else {
      if (resultado == 0) {
        return "No";
      } else if (resultado == 1) {
        return "A baja Intensidad";
      } else {
        return "Si";
      }
    }
  }

  return (
    <>
      <div className="text-gris text-center mt-2">
        <h3>
          <span className="text-white">{diasDesdeEntreno}</span> dias desde el
          ultimo entreno
        </h3>
      </div>
      <div className="bg-main">
        <table className="table text-center">
          <tr className="text-grisOscuro">
            <th>Grupo Muscular</th>
            <th>Dias desde el entreno</th>
            <th>Estado</th>
            <th>Deberia entrenarlo?</th>
          </tr>
          {musculos.map((musculo) => (
            <tr key={musculo.nombre_musculo} className="">
              <th className="mb-2">{musculo.nombre_musculo}</th>
              <th className="mb-2">
                {ultimosEntrenos.find((entreno) =>
                  entreno.tipo_entreno.includes(musculo.nombre_musculo)
                )
                  ? calculaDias(
                      ultimosEntrenos.find((entreno) =>
                        entreno.tipo_entreno.includes(musculo.nombre_musculo)
                      )
                    )
                  : "+3"}
              </th>
              <th>
                {ultimosEntrenos.find((entreno) =>
                  entreno.tipo_entreno.includes(musculo.nombre_musculo)
                )
                  ? comprobarEstado(
                      musculo,
                      ultimosEntrenos.find((entreno) =>
                        entreno.tipo_entreno.includes(musculo.nombre_musculo)
                      ),
                      "texto1"
                    )
                  : "Recuperado"}
              </th>
              <th
                className={
                  ultimosEntrenos.find((entreno) =>
                    entreno.tipo_entreno.includes(musculo.nombre_musculo)
                  )
                    ? comprobarEstado(
                        musculo,
                        ultimosEntrenos.find((entreno) =>
                          entreno.tipo_entreno.includes(musculo.nombre_musculo)
                        ),
                        "clase"
                      )
                    : "bg-verde"
                }
              >
                {ultimosEntrenos.find((entreno) =>
                  entreno.tipo_entreno.includes(musculo.nombre_musculo)
                )
                  ? comprobarEstado(
                      musculo,
                      ultimosEntrenos.find((entreno) =>
                        entreno.tipo_entreno.includes(musculo.nombre_musculo)
                      ),
                      "texto2"
                    )
                  : "Si"}
              </th>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
