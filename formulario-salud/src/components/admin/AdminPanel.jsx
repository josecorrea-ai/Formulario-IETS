// src/components/admin/ActivityLogs.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "../../styles/activityLogs.css";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import ImagenLogo from "../../assets/Logo-IETS.png";

function ActivityLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterAction, setFilterAction] = useState("todas");

  useEffect(() => {
    const obtenerLogs = async () => {
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
      setLogs(listaLogs);
      setFilteredLogs(listaLogs);
    };

    obtenerLogs();
  }, []);

  // Efecto para filtrar y ordenar
  useEffect(() => {
    let result = [...logs];
    
    if (searchTerm) {
      result = result.filter(log => 
        log.admin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.accion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterAction !== "todas") {
      result = result.filter(log => log.accion?.toLowerCase().includes(filterAction.toLowerCase()));
    }
    
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return (a.fecha?.toDate() || 0) - (b.fecha?.toDate() || 0);
      } else {
        return (b.fecha?.toDate() || 0) - (a.fecha?.toDate() || 0);
      }
    });
    
    setFilteredLogs(result);
  }, [logs, searchTerm, filterAction, sortOrder]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Calcular estadísticas
  const accionesPorTipo = {
    crear: logs.filter(log => log.accion?.toLowerCase().includes('crear')).length,
    editar: logs.filter(log => log.accion?.toLowerCase().includes('editar')).length,
    eliminar: logs.filter(log => log.accion?.toLowerCase().includes('eliminar')).length,
    iniciar: logs.filter(log => log.accion?.toLowerCase().includes('iniciar')).length,
    cerrar: logs.filter(log => log.accion?.toLowerCase().includes('cerrar')).length
  };

  const totalAcciones = Object.values(accionesPorTipo).reduce((a, b) => a + b, 0);

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <img src={ImagenLogo} alt="Logo IETS" style={{ width: 'auto', height: '45px', objectFit: 'contain' }} />
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
              <div className="stat-num">{totalAcciones}</div>
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

        {/* Search and Filters Bar */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por usuario, acción u objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          <div className="filters-group">
            <div className="filter-item">
              <label className="filter-label">Acción:</label>
              <select 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value)}
                className="filter-select"
              >
                <option value="todas">Todas</option>
                <option value="crear">Crear</option>
                <option value="editar">Editar</option>
                <option value="eliminar">Eliminar</option>
                <option value="iniciar">Iniciar sesión</option>
                <option value="cerrar">Cerrar sesión</option>
              </select>
            </div>

            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                onClick={() => setSortOrder('asc')}
                title="Más antiguos primero"
              >
                ⬆️ Antiguos
              </button>
              <button 
                className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                onClick={() => setSortOrder('desc')}
                title="Más recientes primero"
              >
                ⬇️ Recientes
              </button>
            </div>
          </div>
        </div>

        {/* Separador visual */}
        <div className="section-divider"></div>

        {/* Results info */}
        <div className="results-info">
          📌 Mostrando {filteredLogs.length} de {logs.length} registros
          {filterAction !== "todas" && ` · Filtrado por: ${filterAction}`}
          {searchTerm && ` · Búsqueda: "${searchTerm}"`}
        </div>

        {/* Header */}
        <div className="header-users">
          <div className="section-title">
            Registro de Actividad
            <span>Últimas 10 acciones en el sistema</span>
          </div>
        </div>

        {/* Table for desktop and tablet - 4 COLUMNAS VISIBLES */}
        <div className="table-wrapper">
          <div className="table-card">
            <div className="table-head" style={{ gridTemplateColumns: "1fr 0.9fr 1.4fr 1.2fr" }}>
              <div className="th-cell">Usuario</div>
              <div className="th-cell">Acción</div>
              <div className="th-cell">Objetivo</div>
              <div className="th-cell">Fecha</div>
            </div>
            <div className="table-body">
              {filteredLogs.length === 0 ? (
                <div className="table-row" style={{ gridTemplateColumns: "1fr 0.9fr 1.4fr 1.2fr" }}>
                  <div className="td-cell no-results" colSpan="4">
                    {searchTerm || filterAction !== "todas" 
                      ? "No se encontraron registros con esos filtros" 
                      : "No hay registros de actividad"}
                  </div>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div className="table-row" style={{ gridTemplateColumns: "1fr 0.9fr 1.4fr 1.2fr" }} key={log.id}>
                    <div className="td-cell">{log.admin || 'N/A'}</div>
                    <div className="td-cell">
                      <span className={`badge badge-${
                        log.accion?.toLowerCase().includes('crear') ? 'cc' : 
                        log.accion?.toLowerCase().includes('editar') ? 'ce' : 
                        log.accion?.toLowerCase().includes('eliminar') ? 'ti' : 
                        log.accion?.toLowerCase().includes('iniciar') ? 'cc' : 
                        log.accion?.toLowerCase().includes('cerrar') ? 'ti' : 'cc'
                      }`}>
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
          {filteredLogs.length === 0 ? (
            <div className="user-card">
              <div style={{ textAlign: 'center', color: '#7A8FA6', padding: '20px' }}>
                {searchTerm || filterAction !== "todas" 
                  ? "No se encontraron registros con esos filtros" 
                  : "No hay registros de actividad"}
              </div>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div className="user-card" key={log.id}>
                <div className="user-card-header">
                  <span className="user-card-name">{log.admin || 'N/A'}</span>
                  <span className={`user-card-badge badge-${
                    log.accion?.toLowerCase().includes('crear') ? 'cc' : 
                    log.accion?.toLowerCase().includes('editar') ? 'ce' : 
                    log.accion?.toLowerCase().includes('eliminar') ? 'ti' : 
                    log.accion?.toLowerCase().includes('iniciar') ? 'cc' : 
                    log.accion?.toLowerCase().includes('cerrar') ? 'ti' : 'cc'
                  }`}>
                    {log.accion || '—'}
                  </span>
                </div>
                <div className="user-card-info">
                  <span>🎯 {log.objetivo || '—'}</span>
                  <span>
                    📅 {log.fecha 
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
            <div className="mobile-counter-number">{filteredLogs.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;