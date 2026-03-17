// src/components/admin/ActivityLogs.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "../../styles/activityLogs.css";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

function ActivityLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const obtenerLogs = async () => {
      // Crear query ordenado por fecha descendente y limitado a 10
      const logsQuery = query(
        collection(db, "logs"),
        orderBy("fecha", "desc"),
        limit(10)
      );
      
      const querySnapshot = await getDocs(logsQuery);
      const listaLogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(listaLogs);
      setLogs(listaLogs);
    };

    obtenerLogs();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Calcular estadísticas
  const accionesPorTipo = {
    crear: logs.filter(log => log.accion?.toLowerCase().includes('crear')).length,
    editar: logs.filter(log => log.accion?.toLowerCase().includes('editar')).length,
    eliminar: logs.filter(log => log.accion?.toLowerCase().includes('eliminar')).length
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="white"/>
                <path d="M2 16C2 16 5 9 9 6C13 3 16 5 16 5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="nav-brand-text">IETS</span>
          </div>
          <div className="nav-divider"></div>
          <Link to="/admin" className="nav-tab">Usuarios</Link>
          <Link to="/logs" className="nav-tab active">Registros</Link>
        </div>
        <div className="nav-right">
          <span className="nav-email">{auth.currentUser?.email || 'usuario@iets.org.co'}</span>
          <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div>
              <div className="stat-num">{logs.length}</div>
              <div className="stat-label">Registros</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✏️</div>
            <div>
              <div className="stat-num">{accionesPorTipo.crear + accionesPorTipo.editar + accionesPorTipo.eliminar}</div>
              <div className="stat-label">Acciones</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📊</div>
            <div>
              <div className="stat-num">{logs.length}</div>
              <div className="stat-label">Últimos 10</div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="header-users">
          <div className="section-title">
            Registro de Actividad
            <span>Últimas 10 acciones en el sistema</span>
          </div>
        </div>

        {/* Table for desktop and tablet */}
        <div className="table-wrapper">
          <div className="table-card">
            <div className="table-head" style={{ gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr" }}>
              <div className="th-cell">Usuario</div>
              <div className="th-cell">Acción</div>
              <div className="th-cell">Objetivo</div>
              <div className="th-cell">Fecha</div>
            </div>
            <div className="table-body">
              {logs.length === 0 ? (
                <div className="table-row" style={{ gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr" }}>
                  <div className="td-cell" colSpan="4">No hay registros de actividad</div>
                </div>
              ) : (
                logs.map((log) => (
                  <div className="table-row" style={{ gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr" }} key={log.id}>
                    <div className="td-cell">{log.admin || 'N/A'}</div>
                    <div className="td-cell">
                      <span className={`badge badge-${log.accion?.toLowerCase().includes('crear') ? 'cc' : 
                                                      log.accion?.toLowerCase().includes('editar') ? 'ce' : 
                                                      log.accion?.toLowerCase().includes('eliminar') ? 'ti' : 'cc'}`}>
                        {log.accion || '—'}
                      </span>
                    </div>
                    <div className="td-cell muted">{log.objetivo || '—'}</div>
                    <div className="td-cell muted">
                      {log.fecha 
                        ? log.fecha?.toDate().toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'Fecha no disponible'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cards for mobile */}
        <div className="users-cards">
          {logs.length === 0 ? (
            <div className="user-card">
              <div style={{ textAlign: 'center', color: '#7A8FA6', padding: '20px' }}>
                No hay registros de actividad
              </div>
            </div>
          ) : (
            logs.map((log) => (
              <div className="user-card" key={log.id}>
                <div className="user-card-header">
                  <span className="user-card-name">{log.admin || 'N/A'}</span>
                  <span className={`user-card-badge badge-${log.accion?.toLowerCase().includes('crear') ? 'cc' : 
                                                              log.accion?.toLowerCase().includes('editar') ? 'ce' : 
                                                              log.accion?.toLowerCase().includes('eliminar') ? 'ti' : 'cc'}`}>
                    {log.accion || '—'}
                  </span>
                </div>
                <div className="user-card-info">
                  <span>Objetivo: {log.objetivo || '—'}</span>
                  <span>
                    {log.fecha 
                      ? log.fecha?.toDate().toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Fecha no disponible'}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {/* Mobile counter */}
          <div className="mobile-counter">
            <div className="mobile-counter-label">Total Registros</div>
            <div className="mobile-counter-number">{logs.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;