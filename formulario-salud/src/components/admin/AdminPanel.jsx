// src/components/admin/AdminPanel.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";
import "../../styles/adminPanel.css";
import { guardarLog } from "../../utils/logService";
import { useNavigate, Link } from "react-router-dom";
import ImagenLogo from "../../assets/Logo-IETS.png";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" o "desc"
  const [filterDocType, setFilterDocType] = useState("todos");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    identificacion: "",
    correo: "",
    fecha: "",
    archivo: ""
  });

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "formularios"));
    const usersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
    setFilteredUsers(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Efecto para filtrar y ordenar cuando cambian los criterios
  useEffect(() => {
    let result = [...users];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(user => 
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.identificacion?.includes(searchTerm)
      );
    }
    
    // Filtrar por tipo de documento
    if (filterDocType !== "todos") {
      result = result.filter(user => user.tipoDocumento === filterDocType);
    }
    
    // Ordenar por nombre
    result.sort((a, b) => {
      const nameA = `${a.nombre || ''} ${a.apellido || ''}`.toLowerCase();
      const nameB = `${b.nombre || ''} ${b.apellido || ''}`.toLowerCase();
      
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    
    setFilteredUsers(result);
  }, [users, searchTerm, filterDocType, sortOrder]);

  const handleEdit = (user) => {
    setIsCreating(false);
    setEditingUser(user);
    setForm({
      nombre: user.nombre,
      apellido: user.apellido,
      tipoDocumento: user.tipoDocumento,
      identificacion: user.identificacion,
      correo: user.correo,
      fecha: user.fecha,
      archivo: user.archivo
    });
  };

  const handleCreate = async () => {
    if (!form.nombre || !form.correo || !form.identificacion)
      return alert("Llena los campos obligatorios");

    await addDoc(collection(db, "formularios"), form);
    await guardarLog(auth.currentUser?.email, "crear_usuario", form.correo);
    closeModal();
    fetchUsers();
  };

  const handleUpdate = async () => {
    if (!form.nombre || !form.correo || !form.identificacion)
      return alert("Llena los campos obligatorios");

    const userRef = doc(db, "formularios", editingUser.id);
    await updateDoc(userRef, form);
    await guardarLog(auth.currentUser?.email, "editar_usuario", form.correo);
    closeModal();
    fetchUsers();
  };

  const handleDelete = async (id, correo) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este registro?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "formularios", id));
    await guardarLog(auth.currentUser?.email, "eliminar_usuario", correo);
    fetchUsers();
  };

  const handleLogout = async () => {
    await guardarLog(auth.currentUser?.email, "cerrar_sesion");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsCreating(false);
    setForm({
      nombre: "",
      apellido: "",
      tipoDocumento: "",
      identificacion: "",
      correo: "",
      fecha: "",
      archivo: ""
    });
  };

  const openCreate = () => {
    navigate("/formulario");
  };

  // Calcular estadísticas
  const documentosSubidos = filteredUsers.filter(u => u.archivo).length;

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <img src={ImagenLogo} alt="Logo IETS" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <span className="nav-brand-text">IETS</span>
          </div>
          <div className="nav-divider"></div>
          <Link to="/admin" className="nav-tab active">Usuarios</Link>
          <Link to="/logs" className="nav-tab">Registros</Link>
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
            <div className="stat-icon blue">👥</div>
            <div>
              <div className="stat-num">{filteredUsers.length}</div>
              <div className="stat-label">Usuarios</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📄</div>
            <div>
              <div className="stat-num">{documentosSubidos}</div>
              <div className="stat-label">Documentos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📋</div>
            <div>
              <div className="stat-num">{filteredUsers.length * 2}</div>
              <div className="stat-label">Acciones</div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, correo o identificación..."
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
              <label className="filter-label">Tipo Doc:</label>
              <select 
                value={filterDocType} 
                onChange={(e) => setFilterDocType(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos</option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="TI">TI</option>
              </select>
            </div>

            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                onClick={() => setSortOrder('asc')}
                title="Ordenar A-Z"
              >
                 A-Z
              </button>
              <button 
                className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                onClick={() => setSortOrder('desc')}
                title="Ordenar Z-A"
              >
                 Z-A
              </button>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="results-info">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>

        {/* Header */}
        <div className="header-users">
          <div className="section-title">
            Usuarios Registrados
            <span>Gestiona y administra los registros del sistema</span>
          </div>
          <button className="btn-new" onClick={openCreate}>
            + Nuevo
          </button>
        </div>

        {/* Table for desktop and tablet */}
        <div className="table-wrapper">
          <div className="table-card">
            <div className="table-head">
              <div className="th-cell">Nombre</div>
              <div className="th-cell">Apellido</div>
              <div className="th-cell">Doc.</div>
              <div className="th-cell">Identificación</div>
              <div className="th-cell">Correo</div>
              <div className="th-cell">Nacimiento</div>
              <div className="th-cell">Archivo</div>
              <div className="th-cell">Acciones</div>
            </div>
            <div className="table-body">
              {filteredUsers.length === 0 ? (
                <div className="table-row">
                  <div className="td-cell no-results" colSpan="8">
                    {searchTerm || filterDocType !== "todos" 
                      ? "No se encontraron usuarios con esos filtros" 
                      : "No hay usuarios registrados"}
                  </div>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div className="table-row" key={u.id}>
                    <div className="td-cell">{u.nombre || '-'}</div>
                    <div className="td-cell">{u.apellido || '-'}</div>
                    <div className="td-cell">
                      <span className={`badge badge-${u.tipoDocumento?.toLowerCase() || 'cc'}`}>
                        {u.tipoDocumento || 'CC'}
                      </span>
                    </div>
                    <div className="td-cell muted">{u.identificacion || '-'}</div>
                    <div className="td-cell muted">{u.correo || '-'}</div>
                    <div className="td-cell muted">{u.fecha || '-'}</div>
                    <div className="td-cell">
                      {u.archivo ? (
                        <a href={u.archivo} target="_blank" rel="noreferrer" className="link-pdf">Ver PDF</a>
                      ) : (
                        <span className="no-file">Sin archivo</span>
                      )}
                    </div>
                    <div className="td-cell">
                      <button className="btn-edit" onClick={() => handleEdit(u)}>Editar</button>
                      <button className="btn-del" onClick={() => handleDelete(u.id, u.correo)}>Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cards for mobile */}
        <div className="users-cards">
          {filteredUsers.length === 0 ? (
            <div className="user-card">
              <div style={{ textAlign: 'center', color: '#7A8FA6', padding: '20px' }}>
                {searchTerm || filterDocType !== "todos" 
                  ? "No se encontraron usuarios con esos filtros" 
                  : "No hay usuarios registrados"}
              </div>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div className="user-card" key={u.id}>
                <div className="user-card-header">
                  <span className="user-card-name">{u.nombre} {u.apellido}</span>
                  <span className={`user-card-badge badge-${u.tipoDocumento?.toLowerCase() || 'cc'}`}>
                    {u.tipoDocumento || 'CC'} · {u.identificacion || ''}
                  </span>
                </div>
                <div className="user-card-info">
                  <span>{u.correo || ''}</span>
                  <span>{u.fecha || ''}</span>
                </div>
                <div className="user-card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(u)}>Editar</button>
                  <button className="btn-del" onClick={() => handleDelete(u.id, u.correo)}>Eliminar</button>
                  {u.archivo ? (
                    <a href={u.archivo} target="_blank" rel="noreferrer" className="link-pdf">Ver PDF</a>
                  ) : (
                    <span className="no-file">Sin archivo</span>
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Mobile counter */}
          <div className="mobile-counter">
            <div className="mobile-counter-label">Usuarios Registrados</div>
            <div className="mobile-counter-number">{filteredUsers.length}</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isCreating ? "Nuevo Usuario" : "Editar Usuario"}</h2>
            <input 
              name="nombre" 
              placeholder="Nombre" 
              value={form.nombre} 
              onChange={handleChange} 
            />
            <input 
              name="apellido" 
              placeholder="Apellido" 
              value={form.apellido} 
              onChange={handleChange} 
            />
            <input 
              name="tipoDocumento" 
              placeholder="Tipo Documento (CC, TI, CE)" 
              value={form.tipoDocumento} 
              onChange={handleChange} 
            />
            <input 
              name="identificacion" 
              placeholder="Identificación" 
              value={form.identificacion} 
              onChange={handleChange} 
            />
            <input 
              name="correo" 
              placeholder="Correo" 
              value={form.correo} 
              onChange={handleChange} 
            />
            <input 
              name="fecha" 
              type="date" 
              value={form.fecha} 
              onChange={handleChange} 
            />
            <div className="modal-buttons">
              <button className="save-btn" onClick={isCreating ? handleCreate : handleUpdate}>
                {isCreating ? "Crear Usuario" : "Actualizar"}
              </button>
              <button className="close-btn" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}