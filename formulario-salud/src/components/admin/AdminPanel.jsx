// src/components/admin/AdminPanel.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";
import "../../styles/adminPanel.css";
import { guardarLog } from "../../utils/logService";
import { useNavigate } from "react-router-dom";
import NavBar from "../navigation/navBar.jsx";

export default function AdminPanel() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

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

    setUsers(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
    );

  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

    await guardarLog(auth.currentUser.email, "crear_usuario", form.correo);

    closeModal();
    fetchUsers();

  };

  const handleUpdate = async () => {

    if (!form.nombre || !form.correo || !form.identificacion)
      return alert("Llena los campos obligatorios");

    const userRef = doc(db, "formularios", editingUser.id);

    await updateDoc(userRef, form);

    await guardarLog(auth.currentUser.email, "editar_usuario", form.correo);

    closeModal();
    fetchUsers();

  };

  const handleDelete = async (id, correo) => {

    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este registro?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "formularios", id));

    await guardarLog(auth.currentUser.email, "eliminar_usuario", correo);

    fetchUsers();

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

  return (

      
    <div className="admin-container">
      <NavBar />

      <div className="user-list">

        <div className="header-users">
          <h2>Usuarios Registrados</h2>

          <button className="btn-new" onClick={openCreate}>
            + Nuevo
          </button>
        </div>

        {/* TABLA (PC) */}

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo Documento</th>
                <th>Identificación</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Archivo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 && (
                <tr>
                  <td colSpan="8">No hay usuarios registrados</td>
                </tr>
              )}

              {users.map((u) => (

                <tr key={u.id}>

                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.tipoDocumento}</td>
                  <td>{u.identificacion}</td>
                  <td>{u.correo}</td>
                  <td>{u.fecha}</td>

                  <td>
                    {u.archivo
                      ? <a href={u.archivo} target="_blank" rel="noreferrer">Ver PDF</a>
                      : "Sin archivo"}
                  </td>

                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(u)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDelete(u.id, u.correo)}>Eliminar</button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* CARDS (CELULAR) */}

        <div className="users-cards">

          {users.map((u) => (

            <div className="user-card" key={u.id}>

              <div className="card-field">
                <span>Nombre:</span> {u.nombre}
              </div>

              <div className="card-field">
                <span>Apellido:</span> {u.apellido}
              </div>

              <div className="card-field">
                <span>Documento:</span> {u.tipoDocumento}
              </div>

              <div className="card-field">
                <span>Identificación:</span> {u.identificacion}
              </div>

              <div className="card-field">
                <span>Correo:</span> {u.correo}
              </div>

              <div className="card-field">
                <span>Fecha:</span> {u.fecha}
              </div>

              <div className="card-field">
                <span>Archivo:</span>

                {u.archivo
                  ? <a href={u.archivo} target="_blank" rel="noreferrer">Ver PDF</a>
                  : "Sin archivo"}
              </div>

              <div className="card-actions">

                <button className="edit-btn" onClick={() => handleEdit(u)}>
                  Editar
                </button>

                <button className="delete-btn" onClick={() => handleDelete(u.id, u.correo)}>
                  Eliminar
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="user-counter">

        <span className="counter-title">
          Número de usuarios registrados
        </span>

        <div className="counter-circle">
          {users.length}
        </div>

      </div>

      {editingUser && (

        <div className="modal-overlay" onClick={closeModal}>

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>
              {isCreating ? "Nuevo Usuario" : "Editar Usuario"}
            </h2>

            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange}/>
            <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange}/>
            <input name="tipoDocumento" placeholder="Tipo Documento" value={form.tipoDocumento} onChange={handleChange}/>
            <input name="identificacion" placeholder="Identificación" value={form.identificacion} onChange={handleChange}/>
            <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange}/>
            <input name="fecha" type="date" value={form.fecha} onChange={handleChange}/>

            <div className="modal-buttons">

              <button className="save-btn" onClick={isCreating ? handleCreate : handleUpdate}>
                {isCreating ? "Crear Usuario" : "Actualizar"}
              </button>

              <button className="close-btn" onClick={closeModal}>
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}