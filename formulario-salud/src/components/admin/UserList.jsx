import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function UserList({ onEdit }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "formulario"));
    const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "formulario", id));
    fetchUsers(); // refrescar la lista
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.nombre}</td>
            <td>{u.email}</td>
            <td>
              <button onClick={() => onEdit(u)}>Editar</button>
              <button onClick={() => handleDelete(u.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}