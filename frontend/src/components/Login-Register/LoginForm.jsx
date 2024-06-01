import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id_usuario: "",
    nombre: "",
    correo: "",
    usuario: "",
    contrasena: "",
  });
  const [userLogin, setUserLogin] = useState({
    usuario: "",
    contrasena: "",
  });

  const getUser = async (parametro) => {
    let getUsuario = await fetch(`http://localhost:4000/login/${parametro}`);
    let data = await getUsuario.json();

    if (data.length == 1) {
      setUser({
        ...user,
        id_usuario: data[0].id_usuario,
        nombre: data[0].nombre,
        correo: data[0].correo,
        usuario: data[0].usuario,
        contrasena: data[0].contrasena,
      });
      setUserLogin({ ...userLogin, usuario: parametro });
    } else {
      setUser({
        id_usuario: "",
        nombre: "",
        correo: "",
        usuario: "",
        contrasena: "",
      });
    }
  };
  const handleBlur = (e) => {
    if (e.target.name == "contrasena") {
      setUserLogin({ ...userLogin, contrasena: e.target.value });
    }
    if (e.target.name == "usuario") {
      getUser(user.usuario, "usuario");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.usuario == userLogin.usuario) {
      if (user.contrasena == userLogin.contrasena) {
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/rutinas");
      } else {
        alert("La contaseña es incorrecta");
      }
    } else {
      alert("El usuario es incorrecto");
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h2 className="text-gris text-center my-4">
        bienvenido a <span className="text-white">gymrat</span>, tu aplicacion
        para seguir tu desarrollo en el gimnasio
      </h2>
      <div className="card bg-main w-25 m-0 m-auto">
        <div className="card-body">
          <h4 className="card-title text-center">Login</h4>
          <form action="" method="get">
            <input
              type="text"
              className="form-control bg-white mb-2 rounded-3"
              name="usuario"
              placeholder="usuario..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <input
              type="password"
              className="form-control bg-white rounded-3"
              name="contrasena"
              placeholder="contraseña..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </form>
          <div className="d-flex mt-5 justify-content-between align-items-center">
            <Link to="/registrar" className="nav-link active">
              no tienes cuenta ?
            </Link>
            <button className="btn bg-white" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
