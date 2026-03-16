// src/components/Navigation/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { guardarLog } from "../../utils/logService";
import "../../styles/navBar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const usuario = auth.currentUser?.email;
      if (usuario) {
        await guardarLog(usuario, "cerrar_sesion", "desde_sidebar");
      }
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">Admin Panel</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {auth.currentUser?.email?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="user-info">
          <span className="user-name">Administrador</span>
          <span className="user-email">{auth.currentUser?.email}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/admin" ? "active" : ""}>
            <Link to="/admin">
              <span className="nav-text">Usuarios</span>
            </Link>
          </li>
          <li className={location.pathname === "/logs" ? "active" : ""}>
            <Link to="/logs">
              <span className="nav-text">Actividad</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-sidebar-btn">
          <span className="logout-text">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}