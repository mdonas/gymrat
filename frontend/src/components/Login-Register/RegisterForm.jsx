import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  //usuarioNuevo
  const [user, setUser] = useState({
    nombre: "",
    correo: "",
    usuario: "",
    contrasena: "",
  });
  //usuarioExistente
  const [databaseUser, setDatabaseUser] = useState({
    correo: "",
    usuario: "",
  });

  //recuperamos el usuario en funcion del correo o del usuario, segun lo que halla pasado cuadno se llama
  const getUser = async (parametro, tipo) => {
    if (tipo == "usuario") {
      let getUsuario = await fetch(`http://localhost:4000/login/${parametro}`);
      let data = await getUsuario.json();

      if (data.length == 1) {
        setDatabaseUser({ ...databaseUser, usuario: data[0].usuario });
      } else {
        setDatabaseUser({ ...databaseUser, usuario: "" });
      }
    } else if (tipo == "correo") {
      let getEmail = await fetch(
        `http://localhost:4000/registrar/${parametro}`
      );
      let data = await getEmail.json();
      if (data.length == 1) {
        setDatabaseUser({ ...databaseUser, correo: data[0].correo });
      } else {
        setDatabaseUser({ ...databaseUser, correo: "" });
      }
    }
  };

  //si el databaseUser tiene datos , es que existe por lo que reportamos un error u otro
  //Si no hay datos hacemos la peticion y vamos a la página de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (databaseUser.usuario) {
      alert("Ya existe el usuario: " + databaseUser.usuario);
    } else if (databaseUser.correo) {
      alert("Ya existe una persona con el correo: " + databaseUser.correo);
    } else {
      try {
        await fetch("http://localhost:4000/registrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };
  //vamos actualizando los datos cuando cambian
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  //En el onblur es cuando llamamos a getUser para recuperar el usuario que coincida con esos valores
  const handleBlur = (e) => {
    if (e.target.name == "correo") {
      getUser(user.correo, "correo");
    }
    if (e.target.name == "usuario") {
      getUser(user.usuario, "usuario");
    }
  };
  //agrupamos la comprobacion de si los campos son correctos
  function isValid() {
    if (
      validateNombre(user.nombre) &&
      validateCorreo(user.correo) &&
      validateUsuario(user.usuario) &&
      validateContraseña(user.contrasena)
    ) {
      return false;
    } else {
      return true;
    }
  }
  function validateNombre(nombre) {
    if (!nombre.trim()) {
      return false;
    } else {
      return true;
    }
  }

  function validateCorreo(correo) {
    //si no quieren actualizar la descripcion lo mantenemos
    if (!correo.trim()) {
      return false;
    } else if (
      !/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)
    ) {
      return false;
    } else {
      return true;
    }
  }

  function validateUsuario(usuario) {
    if (!usuario.trim()) {
      return false;
    } else {
      return true;
    }
  }

  function validateContraseña(contraseña) {
    if (!contraseña.trim()) {
      return false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(contraseña)
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <h2 className="text-gris text-center my-4">
        bienvenido a <span className="text-white">gymrat</span>, tu aplicacion
        para seguir tu desarrollo en el gimnasio
      </h2>
      <div className="card bg-main w-25 m-0 m-auto">
        <div className="card-body">
          <h4 className="card-title text-center">Registrar</h4>
          <form action="" method="get">
            <input
              type="text"
              className="form-control bg-white mb-2 rounded-3"
              name="nombre"
              placeholder="nombre..."
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="form-control bg-white mb-2 rounded-3"
              name="correo"
              placeholder="correo..."
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <input
              type="text"
              className="form-control bg-white mb-2 rounded-3"
              name="usuario"
              placeholder="usuario..."
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <input
              type="password"
              className="form-control bg-white rounded-3"
              name="contrasena"
              placeholder="contraseña..."
              onChange={handleChange}
              required
            />
            <p className="info">
              Debe contener 8 caracteres con numeros, mayusculas y minusculas...
            </p>
          </form>

          <div className="d-flex mt-5 justify-content-between align-items-center">
            <Link to="/" className="nav-link active">
              ya tienes cuenta ?
            </Link>
            <button
              className="btn bg-white"
              onClick={handleSubmit}
              disabled={isValid()}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
