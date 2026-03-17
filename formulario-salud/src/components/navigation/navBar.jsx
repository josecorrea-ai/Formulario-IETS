import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { guardarLog } from "../../utils/logService";
import { useState } from "react";
import "../../styles/navBar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const usuario = auth.currentUser?.email;
      if (usuario) {
        await guardarLog(usuario, "cerrar_sesion", "desde_navbar");
      }
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <>
      <div className="navbar">
        {/* LOGO */}
        <div className="navbar-left">
          <span className="logo-text">IETS</span>
        </div>

        {/* LINKS (desktop) */}
        <div className="navbar-center">
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
            Usuarios
          </Link>

          <Link to="/logs" className={location.pathname === "/logs" ? "active" : ""}>
            Registros
          </Link>
        </div>

        {/* DERECHA */}
        <div className="navbar-right">
          <span className="user-email">
            {auth.currentUser?.email}
          </span>

          <button onClick={handleLogout} className="logout-btn">
            Cerrar sesión
          </button>

          {/* BOTÓN HAMBURGUESA */}
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Usuarios
          </Link>

          <Link to="/logs" onClick={() => setMenuOpen(false)}>
            Registros
          </Link>

          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </>
  );
}