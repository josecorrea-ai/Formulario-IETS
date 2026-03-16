import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import "../../styles/activityLogs.css"; 
import NavBar from "../navigation/navBar.jsx";


function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const obtenerLogs = async () => {
      const querySnapshot = await getDocs(collection(db, "logs"));
      const listaLogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(listaLogs);
      setLogs(listaLogs);
    };

    obtenerLogs();
  }, []);

  return (
    <div className="admin-container">
      <NavBar />

      <div className="user-list">
        <div className="header-users">
          <h2>Registro de Actividad</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Objetivo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay registros de actividad</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.admin || 'N/A'}</td>
                    <td>
                      <span className={`action-badge action-${log.accion?.toLowerCase() || 'default'}`}>
                        {log.accion || '—'}
                      </span>
                    </td>
                    <td>{log.objetivo || '—'}</td>
                    <td>
                      {log.fecha 
                        ? log.fecha?.toDate().toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Fecha no disponible'}
                    </td>
                    <td>
                      <button className="edit-btn">Editar</button>
                      <button className="delete-btn">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Vista de tarjetas para móvil */}
        <div className="users-cards">
          {logs.length === 0 ? (
            <div className="user-card">
              <p>No hay registros de actividad</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="user-card">
                <div className="card-field">
                  <span>Usuario:</span> {log.admin || 'N/A'}
                </div>
                <div className="card-field">
                  <span>Acción:</span> {log.accion || '—'}
                </div>
                <div className="card-field">
                  <span>Objetivo:</span> {log.objetivo || '—'}
                </div>
                <div className="card-field">
                  <span>Fecha:</span> {log.fecha 
                    ? log.fecha?.toDate().toLocaleString()
                    : 'Fecha no disponible'}
                </div>
                <div className="card-actions">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contador de usuarios */}
      <div className="user-counter">
        <span className="counter-title">Total de registros</span>
        <div className="counter-circle">
          {logs.length}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;