import { Link, useLocation } from "react-router-dom";

export default function ButtonAppBar() {
  const location = useLocation();
  const isLoginRegisterPage =
    location.pathname === "/" || location.pathname === "/registrar";

  function paginaActiva(pagina) {
    if (location.pathname === pagina) {
      return "nav-link active";
    } else {
      return "nav-link";
    }
  }

  return (
    !isLoginRegisterPage && (
      <>
        <nav className="navbar navbar-expand-sm bg-main">
          <div className="container">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <Link to="/">
                <img
                  src="../img/MainLogo.jpg"
                  alt="logo"
                  width={60}
                  title="Ir a la pagina de Inicio"
                />
              </Link>
              <ul className="navbar-nav">
                <li className="nav-item h5">
                  <Link
                    to="/rutinas"
                    className={paginaActiva("/rutinas")}
                    href="#"
                    aria-current="page"
                  >
                    Mis Rutinas
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link
                    to="/recuperacion"
                    className={paginaActiva("/recuperacion")}
                  >
                    Recuperacion
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link
                    className={paginaActiva("/historial")}
                    to="/historial"
                    aria-current="page"
                  >
                    Historial
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link className={paginaActiva("/progreso")} to="/progreso">
                    Progreso
                  </Link>
                </li>
              </ul>
              <Link to="/">
                <img
                  src="../img/MainLogo.jpg"
                  alt="logo"
                  width={60}
                  title="Ir a la pagina de Inicio"
                />
              </Link>
            </div>
          </div>
        </nav>
      </>
    )
  );
}
