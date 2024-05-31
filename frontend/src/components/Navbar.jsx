import { Link, useLocation } from "react-router-dom";

export default function ButtonAppBar() {
  const location = useLocation();
  const isLoginRegisterPage =
    location.pathname === "/" || location.pathname === "/registrar";

  return (
    !isLoginRegisterPage && (
      <>
        <nav className="navbar navbar-expand-sm bg-main">
          <div className="container">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <Link to="/">
                <img src="../public/img/MainLogo.jpg" alt="" width={60} />
              </Link>
              <ul className="navbar-nav">
                <li className="nav-item h5">
                  <Link
                    to="/rutinas"
                    className="nav-link active"
                    href="#"
                    aria-current="page"
                  >
                    Mis Rutinas
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link to="/recuperacion" className="nav-link active">
                    Recuperacion
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link
                    className="nav-link active"
                    to="/historial"
                    aria-current="page"
                  >
                    Historial
                  </Link>
                </li>
                <li className="nav-item h5">
                  <Link className="nav-link active" to="/progreso">
                    Progreso
                  </Link>
                </li>
              </ul>
              <Link to="/">
                <img src="../public/img/MainLogo.jpg" alt="" width={60} />
              </Link>
            </div>
          </div>
        </nav>
      </>
    )
  );
}
