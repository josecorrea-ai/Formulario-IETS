import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

export default function UserForm({ userToEdit, onSave }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  
  useEffect(() => {
    if (userToEdit) {
      setNombre(userToEdit.nombre);
      setEmail(userToEdit.email);
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToEdit) {
      const userRef = doc(db, "formulario", userToEdit.id);
      await updateDoc(userRef, { nombre, email });
    } else {
      await addDoc(collection(db, "formulario"), { nombre, email });
    }
    setNombre("");
    setEmail("");
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">{userToEdit ? "Actualizar" : "Crear"}</button>
    </form>
  );
}