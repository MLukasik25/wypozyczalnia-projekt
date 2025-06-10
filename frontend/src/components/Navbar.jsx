import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, rola, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Wypożyczalnia</Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
              Strona Główna
            </NavLink>
          </li>

          {!token && (
            <>
              <li className="nav-item">
                <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Logowanie
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/rejestracja" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Rejestracja
                </NavLink>
              </li>
            </>
          )}

          {token && (
            <>
              {rola === "klient" && (
                <li className="nav-item">
                  <NavLink to="/panel" className={({ isActive }) => isActive ? "active-link" : ""}>
                    Panel
                  </NavLink>
                </li>
              )}
              {rola === "admin" && (
                <li className="nav-item">
                  <NavLink to="/panel-admina" className={({ isActive }) => isActive ? "active-link" : ""}>
                    Panel Administratora
                  </NavLink>
                </li>
              )}
              {rola === "pracownik" && (
                <li className="nav-item">
                  <NavLink to="/panel-pracownika" className={({ isActive }) => isActive ? "active-link" : ""}>
                    Panel Pracownika
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout}>Wyloguj</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
